/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function($) {
    var rootDiv = '';
    var treeGround = null;
    var newMemberForm = '';
    var memberName = '';
    var memberGender = '';
    var memberAge = '';
    var memberPic = '';
    var memberRelation = '';
    var familyTree = new Array();
    var memberId = 0;
    var selectedMember = null;// refrence to selected member
    var self = true;
    var memberSpace = 92;
    var memberWidth = 115;
    var memberHeight = 107;
    var memberDetails = null;
    var options_menu = null;
    var object = new Object();
    var rut = null;
    var parent = null;

    $.fn.pk_family = function(options) {
        if (rootDiv == null) {
            // error message in console
            jQuery.error('wrong id given');
            return;
        }
        rootDiv = this;
        init();
    }

    // function to create tree from json data
    $.fn.pk_family_create = function(options) {
        if (rootDiv == null) {
            // error message in console
            jQuery.error('wrong id given');
            return;
        }
        rootDiv = this;
        var settings = $.extend({
            // These are the defaults.
            data: "",
        }, options);
        var obj = jQuery.parseJSON(settings.data);
        addBreadingGround();
        parent = $('<ul>');
        $(parent).appendTo(treeGround);
        traverseObj(obj);

        createNewMemberForm();
        member_details();
        createOptionsMenu();
        document.oncontextmenu = function() {
            return false;
        };

    }
    function tempTest(obj) {
        for (var i in obj) {
            document.write(i + " &nbsp;");
            if (i.indexOf('a') > -1 && i.length == 2) {
                ;
            } else {
                tempTest(obj[i]);
            }
        }
        return;
    }
    function traverseObj(obj) {

        for (var i in obj) {
            if (i.indexOf("li") > -1) {
                var li = $('<li>');
                $(li).appendTo(parent);
                parent = li;
                traverseObj(obj[i]);
				parent = $(parent).parent();
            }
            if (i.indexOf("a") > -1 && i.length == 2) {
                var link = $('<a>');
                link.attr('data-name', obj[i].name);
                link.attr('data-age', obj[i].age);
                link.attr('data-gender', obj[i].gender);
                link.attr('data-relation', obj[i].relation);
				if(obj[i].relation == 'Spouse'){
					link.attr('class', 'spouse');
				}
                var center = $('<center>').appendTo(link);
                var pic = $('<img>').attr('src', obj[i].pic);
                var extraData = "";
                if (obj[i].gender == "Male") {
                    extraData = "(M)";
                } else {
                    extraData = "(F)";
                }
                $(pic).appendTo(center);
                $(center).append($('<br>'));
                $('<span>').html(obj[i].name + " " + extraData).appendTo(center);
                $(link).mousedown(function(event) {
                    if (event.button == 2) {
                        displayPopMenu(this, event);
                        return false;
                    }
                    return true;
                });
                $(link).appendTo(parent);
            }

            if (i.indexOf("ul") > -1) {
                var ul = $('<ul>');
                $(ul).appendTo(parent);
                parent = ul;
                traverseObj(obj[i]);
                return;
            }
        }
        return;
    }

    // function to send data to server
   $.send_Family =  $.fn.pk_family_send = function(options) {
        if (rootDiv == null) {
            // error message in console
            jQuery.error('wrong id given');
            return;
        }
        var settings = $.extend({
            // These are the defaults.
            url: "",
        }, options);
        var data = createSendURL();
        data = data.replace(new RegExp(']', 'g'), ""); 
        data = data.replace(new RegExp('\\[', 'g'), ""); 
        console.log(data);
        $.ajax({
            url: settings.url + "?tree=" + data,
        }).done(function() {
            alert('completed');
        });
    }

    function createSendURL() {
        rut = $(treeGround).find("ul:first");
        parent = object;
        object = createJson(rut);
        return (JSON.stringify(object));

    }

    function createJson(root) {
        var thisObj = [];
        if ($(root).prop('tagName') == "UL") {
            var item = {};
            var i = 0;
            $(root).children('li').each(function() {
                item["li" + i] = createJson(this);
                i++;
            });
            thisObj.push(item);
            return thisObj;
        }
        if ($(root).prop('tagName') == "LI") {
            var item = {};
            var i = 0;
            $(root).children('a').each(function() {
                var m = "a" + i;
                item[m] = {};
                item[m]["name"] = $(this).attr("data-name");
                item[m]["age"] = $(this).attr("data-age");
                item[m]["gender"] = $(this).attr("data-gender");
                try {
                    item[m]["relation"] = $(this).attr("data-relation");
                } catch (e) {
                    item[m]["relation"] = "self";
                }
                item[m]["pic"] = $(this).find('img:first').attr("src");
                i++;
            });

            if ($(root).find('ul:first').length) {
                parent = thisObj;
                item["ul"] = createJson($(root).find('ul:first'));
            }
            thisObj.push(item);
            return thisObj;
        }
    }
    function init() {
        // addMemberButton();
        addBreadingGround();
        createNewMemberForm();
        member_details();
        createOptionsMenu();
        displayFirstForm();
        document.oncontextmenu = function() {
            return false;
        };
    }

    function createOptionsMenu() {
        var div = $('<div>').attr('id', 'pk-popmenu');
        var ul = $('<ul>');
        // add member button
        var liAdd = $('<li>').html('Add Member').appendTo(ul);
        liAdd.click(function(event) {
            displayForm();
            $(options_menu).css('display', 'none');
        });
        // view member button
        var liDisplay = $('<li>').html('View Details').appendTo(ul);
        liDisplay.click(function(event) {
            displayData(selectedMember);
            $(options_menu).css('display', 'none');
        });
        // remove member button
        var liRemove = $('<li>').html('Remove Member').appendTo(ul);
        liRemove.click(function(event) {
            removeMember(selectedMember);
            $(options_menu).css('display', 'none');
        });
        // cancel the pop menu
        var liCancel = $('<li>').html('Cancel').appendTo(ul);
        liCancel.click(function(event) {
            //displayForm(this);
            $(options_menu).css('display', 'none');
        });
        $(div).append(ul);
        options_menu = div;
        $(options_menu).appendTo(rootDiv);

    }
    function createNewMemberForm() {
        var memberForm = $('<div>').attr('id', 'pk-memberForm');
        var cross = $('<div>').attr('class', 'pk-cross');
        $(cross).text('X');
        $(cross).click(closeForm);
        $(cross).appendTo(memberForm);
        var table = $('<table>').appendTo(memberForm);
        // name
        $('<tr>').html('<td><label>Name</label></td><td><input type="text" value="" id="pk-name"/></td>').appendTo(table);
        $('<tr>').html(' <td><label>Gender</label></td><td><select id="pk-gender"><option value="Male">Male</option><option value="Female">Female</option></select></td>').appendTo(table);
        $('<tr>').html('<td><label>Age</label></td><td><input type="text" value="" id="pk-age"></td>').appendTo(table);
        $('<tr>').html(' <td class="relations"><label>Relation</label></td><td class="relations"><select id="pk-relation">\n\\n\
<option value="Mother">Mother</option>\n\
<option value="Father">Father</option>\n\\n\
<option value="Sibling">Sibling</option>\n\\n\
<option value="Child">Child</option>\n\\n\
<option value="Spouse">Spouse</option>\n\\n\
</select></td>').appendTo(table);
        $('<tr>').html('<td><label>Upload Photo</label></td><td><input type="file" id="pk-picture"></td>').appendTo(table);
        var buttonSave = $('<input>').attr('type', 'button');
        $(buttonSave).attr('value', 'Save');
        $(buttonSave).click(saveForm);
        var td = $('<td>').attr('colspan', '2');
        td.css('text-align', 'center');
        td.append(buttonSave);
        $('<tr>').append(td).appendTo(table);
        newMemberForm = memberForm;
        $(newMemberForm).appendTo(rootDiv);
    }

    function member_details() {
        memberDetails = $('<div>').attr('id', 'pk-member-details');
        $(memberDetails).appendTo(rootDiv);
    }

    function closeForm() {
        $(newMemberForm).css('display', 'none');
    }

    function saveForm() {
        memberName = $('#pk-name').val();
        memberGender = $('#pk-gender').val();
        memberAge = $('#pk-age').val();
        memberPic = $('#pk-picture');
        memberRelation = $('#pk-relation').val();
        //clear exsiting data from form
        $('#pk-name').val('');
        $('#pk-age').val('');
        $('#pk-relation').val('');
        // after saving
        addMember();
        closeForm();
    }

    function addBreadingGround() {
        var member = $('<div>').attr('id', 'treeGround');
        $(member).attr('class', 'tree-ground');
        $(member).appendTo(rootDiv);
        treeGround = member;
        $(treeGround).draggable();
    }

    function addMemberButton() {
        var member = $('<input>').attr('type', 'button');
        $(member).attr('value', 'Add Member');
        $(member).click(displayForm);
        $(member).appendTo(rootDiv);
    }
    function displayForm(input) {
        $('.relations').css('display', '');
        $(newMemberForm).css('display', 'block');
    }
    function displayPopMenu(input, event) {
        if ($(options_menu).css('display') == 'none') {
            selectedMember = input;
            self = false;
            $(options_menu).css('display', 'block');
            $(options_menu).css('top', event.clientY);
            $(options_menu).css('left', event.clientX);
        }
    }
    function displayFirstForm() {
        selectedMember = null;
        self = true;
        $('.relations').css('display', 'none');
        $(newMemberForm).css('display', 'block');
        $('#pk-relation').val('Main');
    }
    function addMember() {
        var aLink = $('<a>').attr('href', '#');
        var center = $('<center>').appendTo(aLink);
        var pic = $('<img>').attr('src', 'images/profile.png');
        var extraData = "";
        if (memberGender == "Male") {
            extraData = "(M)";
        } else {
            extraData = "(F)";
            $(pic).attr('src', 'images/profile-f.png');
        }
        $(pic).appendTo(center);
        $(center).append($('<br>'));
        $('<span>').html(memberName + " " + extraData).appendTo(center);
        readImage(memberPic, pic);

        var li = $('<li>').append(aLink);
        $(aLink).attr('data-name', memberName);
        $(aLink).attr('data-gender', memberGender);
        $(aLink).attr('data-age', memberAge);
        $(aLink).attr('data-relation', memberRelation);
        $(aLink).mousedown(function(event) {
            if (event.button == 2) {
                displayPopMenu(this, event);
                return false;
            }
            return true;
        });
        var sParent = $(selectedMember).parent(); // super parent
        if (selectedMember != null) {
            if (memberRelation == 'Mother') {
				var parent = $(sParent).parent();
                var parentParent = $(parent).parent();
                var fatherElement = $(parentParent).find("a:first");

                if(fatherElement.length == 0){
					console.log('adding adajecent to father');
					console.log(fatherElement);
					var tmp = $(fatherElement).parent();
					$(aLink).attr('class', 'mother');
					$(tmp).append(aLink);
				
				}else{
					console.log('adding mother alone');
					var ul = $('<ul>').append(li);
					$(parent).appendTo(li);
					$(parentParent).append(ul);
				}
            }
            if (memberRelation == 'Spouse') {
                $(aLink).attr('class', 'spouse');
                var toPrepend = $(sParent).find('a:first');
                $(sParent).prepend(aLink);
                $(sParent).prepend(toPrepend);
            }
            if (memberRelation == 'Child') {
                var toAddUL = $(sParent).find('UL:first');
                if ($(toAddUL).prop('tagName') == 'UL') {
                    $(toAddUL).append(li);
                } else {
                    var ul = $('<ul>').append(li);
                    $(sParent).append(ul);
                }

            }
            if (memberRelation == 'Sibling') {
                $(sParent).parent().append(li);

            }
            if (memberRelation == 'Father') {
                var parent = $(sParent).parent();
                var parentParent = $(parent).parent();
                var ul = $('<ul>').append(li);
                $(parent).appendTo(li);
                $(parentParent).append(ul);
            }
        } else {
            var ul = $('<ul>').append(li);
            $(treeGround).append(ul);

        }
    }

// will show existing user info
    function displayData(element) {
        var innerContent = $('<table>');
        var content = '';
        var cross = $('<div>').attr('class', 'pk-cross');
        $(cross).text('X');
        $(cross).click(function() {
            $(memberDetails).css('display', 'none')
        });
        $(memberDetails).empty();
        $(cross).appendTo(memberDetails);
        content = content + '<tr><td>Name</td><td>' + $(element).attr('data-name') + '</td></tr>';
        content = content + '<tr><td>Age</td><td>' + $(element).attr('data-age') + '</td></tr>';
        content = content + '<tr><td>Gender</td><td>' + $(element).attr('data-gender') + '</td></tr>';
        if ($(element).attr('data-relation')) {
            content = content + '<tr><td>Relation</td><td>' + $(element).attr('data-relation') + '</td></tr>';
        } else {
            content = content + '<tr><td>Relation</td><td>Self</td></tr>';
        }
        content = content + '<tr><td colspan="2" style="text-align:center;"><img src="' + $(element).find('img').attr('src') + '"/></td></tr>';
        $(innerContent).html(content);
        $(memberDetails).append(innerContent);
        $(memberDetails).css('display', 'block');
    }
    function readImage(input, pic) {
        var files = $(input).prop('files');
        if (files && files[0]) {
            var reader = new FileReader();

            reader.onload = function(e) {
                $(pic).attr('src', e.target.result);
            }

            reader.readAsDataURL(files[0]);
        }
    }

    function removeMember(member) {
        if ($(member).attr('data-relation') == 'Sibling') {
            $(member).parent().remove();
        }
        if ($(member).attr('data-relation') == 'Child') {
            var cLen = $(member).parent().children('li').length;
            if (cLen > 1)
                $(member).remove();
            else {
                $(member).parent().remove();
            }
        }
        if ($(member).attr('data-relation') == 'Father') {
            var child = $(member).children('ul');
            var parent = $(member).parent().parent();
            $(child).appendTo(parent);
            $(member).remove();
        }
        if ($(member).attr('data-relation') == 'Spouse') {
            $(member).remove();
        }
    }


}(jQuery));
