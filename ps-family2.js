/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var rootDiv = '';
var treeGround = '';
var newMemberForm = '';
var memberName = '';
var memberGender = '';
var memberAge = '';
var memberPic = '';
var memberRelation = '';
var familyTree = new Array();
var memberId = 0;
var selectedMember;// refrence to selected member
var self = true;
var memberSpace = 92;
var memberWidth = 115;
var memberHeight = 107;

(function($) {
    $.fn.pk_family2 = function(options) {
        rootDiv = this;
        init();
        if (rootDiv == null) {
            // error message in console
            jQuery.error('wrong id given');
        }
    }

    function init() {
        // addMemberButton();
        addBreadingGround();
        createNewMemberForm();
        displayFirstForm();
    }

    function createNewMemberForm() {
        var memberForm = $('<div>').attr('id', 'pk-memberForm');
        var cross = $('<div>').attr('id', 'pk-cross');
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

    function closeForm() {
        $(newMemberForm).css('display', 'none');
    }

    function saveForm() {
        memberName = $('#pk-name').val();
        memberGender = $('#pk-gender').val();
        memberAge = $('#pk-age').val();
        memberPic = $('#pk-picture');
        memberRelation = $('#pk-relation').val();
        // after saving
        addMember();
        closeForm();
    }

    function addBreadingGround() {
        var member = $('<div>').attr('id', 'treeGround');
        $(member).attr('class', 'tree-ground');
        $(member).appendTo(rootDiv);
        treeGround = member;
        // $(treeGround).draggable();
    }

    function addMemberButton() {
        var member = $('<input>').attr('type', 'button');
        $(member).attr('value', 'Add Member');
        $(member).click(displayForm);
        $(member).appendTo(rootDiv);
    }
    function displayForm(input) {
        if (input != null)
            selectedMember = input;
        self = false;
        $('.relations').css('display', '');
        $(newMemberForm).css('display', 'block');
    }
    function displayFirstForm() {
        selectedMember = null;
        self = true;
        $('.relations').css('display', 'none');
        $(newMemberForm).css('display', 'block');
    }
    function addMember() {
        var li = $('<li>').html('<a href="#">' + memberName + '</a>');
        $(li).attr('data-name', memberName);
        $(li).attr('data-gender', memberGender);
        $(li).attr('data-age', memberAge);
        $(li).attr('data-relation', memberRelation);
        $(li).click(function() {
            displayForm(this);
        });

        if (selectedMember != null) {
            if (memberRelation == 'Child') {
                var toAddUL = $(selectedMember).find('UL');
                if ($(toAddUL).prop('tagName') == 'UL') {
                    $(toAddUL).append(li);
                } else {
                    var ul = $('<ul>').append(li);
                    $(selectedMember).append(ul);
                }
            }
            if (memberRelation == 'Sibling') {
                $(selectedMember).parent().append(li);
            }
            if (memberRelation == 'Father') {
                var parent = $(selectedMember).parent();
                var parentParent = $(parent).parent();
                var ul = $('<ul>').append(li);
                //  $(li).append(parent);
                $(parent).appendTo(li);
                $(parentParent).append(ul);
            }
        } else {
            var ul = $('<ul>').append(li);
            $(treeGround).append(ul);
        }
        // var center = $('<center>').appendTo(div);
        //  var pic = $('<img>').attr('src', 'images/profile.png');
        //  $(pic).appendTo(center);
        //  $(center).append($('<br>'));
        //  $('<span>').html(memberName).appendTo(center);
        // readImage(memberPic, pic);
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
}(jQuery));