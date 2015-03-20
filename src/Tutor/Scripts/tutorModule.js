var tutorModule = (function () {
    var hub,
        template,
        url = '/api/tutor';

    var init = function () {
        setupSignalR();
        setupHandlers();
        compileTemplates();
        getCookie("username") === "" ? $(".question-data").hide() : $(".name-data").hide();
        $("#displayname").val(getCookie("username"));
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
        var context = {
            Name: name,
            Location: location,
            Description: description,
            Id: id,
            PanelStyle: 'panel-default',
            canDelete: getCookie("username") === name
        };
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
            questionPanel.removeClass('panel-default, panel-success').addClass('panel-warning');
        if (model.QuestionState === 2)//Answered
            questionPanel.removeClass('panel-default, panel-warning').addClass('panel-success');
    }

    var setupHandlers = function () {
        $('#sendmessage').on('click', sendMessage);
        $('body').on('click', '.delete', deleteMessage);
        $('body').on('click', '.goto, .done', updateMessage);
        $('#saveName').on('click', saveName);
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
                item.canDelete = getCookie("username") === item.Name;
                var html = template(item);
                container.prepend(html);
            }
        }, 'json');
    }

    var sendMessage = function () {
        var userName = getCookie("username");
        var data = { Name: userName, Description: $('#message').val(), Location: $('#location').val() };
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

    var saveName = function (e) {
        document.cookie = "username=" + $('#displayname').val();
        $(".name-data").slideUp();
        $(".question-data").slideDown();
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    return {
        init: init,
        loadMessages: loadAllMessages
    };
}());