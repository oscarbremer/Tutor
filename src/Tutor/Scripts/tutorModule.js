var tutorModule = (function () {
    var hub,
        template,
        url = '/api/tutor';

    var init = function () {
        setupSignalR();
        setupHandlers();
        compileTemplates();
        return this;
    }

    var setupSignalR = function () {
        hub = $.connection.questionHub;
        hub.client.broadcastQuestion = onBroadcastQuestion;
        hub.client.questionDeleted = onDeletedQuestion;
        hub.client.updateQuestion = onUpdatedQuestion;
        $.connection.hub.start().done();
    }

    var onBroadcastQuestion = function (name, description, location, id) {
        var context = { Name: name, Location: location, Description: description, Id: id, PanelStyle: 'panel-default' };
        var html = template(context);
        $('.questions').prepend(html);
    }

    var onDeletedQuestion = function (id) {
        var question = $('[data-id=' + id + ']').closest('.question-item');
        question.fadeOut(function () { question.remove() });
    }

    var onUpdatedQuestion = function (model) {
        var questionPanel = $('[data-id=' + model.Id + ']').closest('.question-item').find('.panel');
        if (model.QuestionState === 1)//InProgress
            questionPanel.removeClass('panel-default').addClass('panel-warning');
        if (model.QuestionState === 2)//Answered
            questionPanel.removeClass('panel-default').addClass('panel-success');
    }

    var setupHandlers = function () {
        $('#sendmessage').on('click', sendMessage);
        $('body').on('click', '.delete', deleteMessage);
        $('body').on('click', '.goto, .done', updateMessage);
    }

    var compileTemplates = function () {
        var source = $("#question-template").html();
        template = Handlebars.compile(source);
    }

    var loadAllMessages = function () {
        var container = $('.questions');
        $.get(url, function (response) {
            for (var i = 0; i < response.length; i++) {
                var item = response[i];
                item.PanelStyle = 'panel-default';
                if (item.QuestionState === 1) //InProgress
                    item.PanelStyle = 'panel-warning';
                if (item.QuestionState === 2) //Answered
                    item.PanelStyle = 'panel-success';
                var html = template(item);
                container.prepend(html);
            }
        }, 'json');
    }

    var sendMessage = function () {
        var data = { Name: $('#displayname').val(), Description: $('#message').val(), Location: $('#location').val() };
        $.post(url, data);
    }

    var deleteMessage = function (e) {
        e.preventDefault();
        var id = $(this).data('id');
        $.ajax({
            url: url,
            type: 'DELETE',
            data: { id: id }
        });
    }

    var updateMessage = function () {

        var parent = $(this).closest('.question-item'),
            id = parent.find('.delete').data('id'),
            name = parent.find('.name').text(),
            location = parent.find('.location').text(),
            description = parent.find('.description').text(),
            state = $(this).hasClass('goto') ? 'InProgress' : "Answered";
        $.ajax({
            url: url,
            type: 'PUT',
            data: { id: id, name: name, location: location, description: description, questionstate: state }
        });
    }

    return {
        init: init,
        loadMessages: loadAllMessages
    };
}());