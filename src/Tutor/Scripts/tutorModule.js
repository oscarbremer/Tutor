var tutorModule = (function() {
    var hub,
        template;

    var init = function () {
        setupSignalR();
        setupHandlers();
        compileTemplates();
        return this;
    }
   
    var setupSignalR = function() {
        hub = $.connection.questionHub;
        hub.client.broadcastQuestion = onBroadcastQuestion;
        $.connection.hub.start().done();

    }

    var onBroadcastQuestion = function(name, message, place) {
        var context = { name: name, place: place };
        var html = template(context);
        $('.questions').prepend(html);
    }
  
    var setupHandlers = function() {
        $('#sendmessage').on('click', sendMessage);
    }

    var compileTemplates = function() {
        var source = $("#question-template").html();
        template = Handlebars.compile(source);
    }

    var sendMessage = function() {
            var data = { Name: $('#displayname').val(), Description: $('#message').val(), Location: "foo", QuestionState: "Unaswered" };
        $.post("/api/tutor", data);
    }

    return{
        init: init
    };
}());