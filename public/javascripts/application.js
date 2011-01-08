// millisecond "constants"
var DAY = 86400000;
var HOUR = 3600000;
var MINUTE = 60000;

function relativeDates() {
    $('#feedback time:not(".confirmed")').each(function(index, element) {
        var timestamp = parseInt($(element).attr('datetime'));
        var now = new Date().getTime();
        var timediff = now - timestamp;
        if (timediff < DAY) {
            var timemsg = null;
            if (timediff < HOUR) {
                if (timediff < MINUTE)
                    timemsg = "Less than a minute ago";
                else if (timediff < MINUTE * 2)
                    timemsg = "1 minute ago";
                else
                    timemsg = parseInt(timediff / MINUTE) + " minutes ago"

            } else if (timediff < HOUR * 2) {
                timemsg = "1 hour ago";
            } else {
                timemsg = parseInt(timediff / HOUR) + " hours ago"
            }
            $(element).text(timemsg);
        }
        // Don't have to check dates more than once
        $(element).addClass('confirmed');
    });
}

function createReplyBox(target) {
    // No HTML5 elements in here, so we can just throw HTML into jQuery (see below for the opposite)
    target.append('<form class="reply_box"><textarea name="content" class="required" placeholder="Enter your thought here..."></textarea><input type="text" class="text required" name="name" placeholder="Your name"><input type="submit" class="submit" value="Reply"></form>');
    // Without adding yet another plugin to listen for new elements, run placeholder function again during the only
    // time new placeholder-enabled fields are created.
    $('input').placeholder();
    $('textarea').placeholder();
}

function validate(target) {
    var isValid = true;
    target.find('.required').each(function(index, element) {
        if ($(element).val().length < 1) {
            isValid = false;
        }
    });
    if (!isValid) {
        alert("Please fill in all fields.");
    }
    return isValid;
}

function populateValues(element, data) {
    element.children('address').text(data['name']);
    // HTML is sanitized in Rails - we want to insert HTML for line breaks.
    element.children('p').html(data['content']);
    element.find('time').attr('datetime', data['datetime']);
    element.find('time').text(data['time']);
    return element;
}

function createReply(post, response) {
    // Need to create elements individually or else innerHTML doesn't work...
    var reply = $(document.createElement('article')).addClass('reply');
    reply.append(document.createElement('address'));
    reply.append(' ');
    reply.append($(document.createElement('span')).addClass('replied').text('replied'));
    reply.append(' ');
    reply.append(document.createElement('p'));
    var footer = $(document.createElement('footer'));
    footer.append(document.createElement('time'));
    reply.append(footer);
    reply = populateValues(reply, response);
    post.children('.replies').append(reply);
    relativeDates();
}

function createPost(response) {
    // Need to create elements individually or else innerHTML doesn't work...
    var post = $(document.createElement('article'));
    post.append(document.createElement('address'));
    post.append(' ');
    post.append(document.createElement('p'));
    var footer = $(document.createElement('footer'));
    footer.append(document.createElement('time'));
    footer.append(' ');
    footer.append($(document.createElement('span')).addClass('separator').html('&bull;'));
    footer.append(' ');
    footer.append($(document.createElement('a')).attr('href', "#").addClass('reply_button').text('Reply'));
    post.append(footer);
    var replies = $(document.createElement('section')).addClass('replies');
    post.append(replies);
    post = populateValues(post, response);
    $('#feedback .feed').prepend(post);
    relativeDates();
}

// onload
$(function() {
    relativeDates();

    $('.reply_button').live('click', function() {
        var article = $(this).closest('article');
        // if the comment already has an existing reply box
        if (article.children().is('.reply_box')) {
            // Shows or hides existing reply box with every click of "Reply"
            article.children('.reply_box').toggle();
        } else {
            createReplyBox($(this).closest('article'));
        }
        // reply box is visible if it was just created, or unhidden
        if (article.children('.reply_box').is(':visible')) {
            article.children('.reply_box').children('textarea').focus();
        }
    });

    $('.reply_box').live('submit', function() {
        var form = $(this);
        if (validate(form)) {
            $.post('reply', form.serialize(), function(response) {
                var post = form.parent();
                createReply(post, response);
                form.hide();
                form[0].reset();
            })
        }
        return false;
    });

    $('.post_box').live('submit', function() {
        var form = $(this);
        if (validate(form)) {
            $.post('post', form.serialize(), function(response) {
                createPost(response);
                form[0].reset();
            })
        }
        return false;
    });

    $('input').placeholder();
    $('textarea').placeholder();
});