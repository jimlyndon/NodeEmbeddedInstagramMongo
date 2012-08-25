// initialize viewmodel for tweets, instagrams, etc.
var viewModel = {
    instagrams : ko.observableArray([]),
    tweets : ko.observableArray([]),
    endAnimation : function(model, evt) {
        $(evt.currentTarget).parent().removeClass('animating');
    }
};

// apply bindings on page load complete
$(function () {
    ko.applyBindings(viewModel);
});

// define tweet knockout.js binding handler for oembed use
// usage: <div data-bind="foreach: tweets"><div data-bind="tweet: $data">
ko.bindingHandlers.tweet = {
    update: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor(),
        unwrappedValue = ko.utils.unwrapObservable(value),
        oembed_url = 'https://api.twitter.com/1/statuses/oembed.json?align=center&id=' + unwrappedValue.id_str;
        
        $.ajax({
          url: oembed_url,
          dataType: "jsonp",
          type: "GET"
        }).done(function (resp, status, xhr) {
            $(element).append("<div>" + resp.html + "</div>");
        });
    }
};

// on initial page load
// replace {} with { id:1234 } to specify starting point
$.post('/instagrams', {}, function(data) {
    $.each(data, function(idx, obj) {
        viewModel.instagrams.push(obj.media);
    });
}, 'json');
// on initial page load
// replace {} with { id:1234 } to specify starting point
$.post('/tweets', {}, function(data) {
    $.each(data, function(idx, obj) {
        viewModel.tweets.push(obj.media);
    });
}, 'json');


// start socket.io
var socket = io.connect(window.location.hostname);

// insert media at top of list on every server message from socket.io
socket.on('message', function(update){ 
    var data = $.parseJSON(update);
    switch(data.channel)
    {
        case 'instagram':
          $.each(data.media, function(idx, obj) {
              viewModel.instagrams.splice(0, 0, obj.media);
          });
          break;
        case 'twitter':
          $.each(data.media, function(idx, obj) {
              viewModel.tweets.splice(0, 0, obj.media);
          });
          break;
        default:
          break;
    }
});