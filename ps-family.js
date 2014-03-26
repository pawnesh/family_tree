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
    $.fn.pk_family = function(options) {
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
        var div = $('<div>').attr('class', 'member');
        var xposition = 500;
        var yposition = 200;
        if (selectedMember != null) {
            if (memberRelation == 'Spouse') {
                // spouse will be added in right
                xposition = parseInt($(selectedMember).attr('data-x')) + memberWidth + memberSpace;
                yposition = parseInt($(selectedMember).attr('data-y'));
            }
            // child will be added below
            if (memberRelation == 'Child') {
                xposition = parseInt($(selectedMember).attr('data-x')) - memberWidth - memberSpace;
                yposition = parseInt($(selectedMember).attr('data-y')) + memberHeight + memberSpace;
            }
            // sibling will be added consicutivly just higer above to current position
            if (memberRelation == 'Sibling') {
                xposition = $(selectedMember).attr('data-x') + (memberWidth*2) + (memberSpace*2);
                yposition = $(selectedMember).attr('data-y') - memberHeight - memberSpace;
            }
            // father will be added above left
            if (memberRelation == 'Father') {
                xposition = $(selectedMember).attr('data-x') - memberWidth - memberSpace;
                yposition = $(selectedMember).attr('data-y') -(memberHeight*2) - (memberSpace*2);
            }
            // mother will be added above right
            if (memberRelation == 'Mother') {
                xposition = $(selectedMember).attr('data-x')  - memberWidth - memberSpace;
                yposition = $(selectedMember).attr('data-y') - (memberHeight*2) - (memberSpace*2);
                // from father prespective mother is wife
                xposition = xposition + memberWidth + memberSpace;
            }
        }

        $(div).attr('data-name', memberName);
        $(div).attr('data-gender', memberGender);
        $(div).attr('data-age', memberAge);
        $(div).attr('data-relation', memberRelation);
        $(div).attr('data-id', memberId);
        $(div).attr('data-x', xposition);
        $(div).attr('data-y', yposition);
        $(div).css('left', xposition);
        $(div).css('top', yposition);
        $(div).click(function() {
            displayForm(this)
        });
        $(treeGround).append(div);
        var center = $('<center>').appendTo(div);
        var pic = $('<img>').attr('src', 'images/profile.png');
        $(pic).appendTo(center);
        $(center).append($('<br>'));
        $('<span>').html(memberName).appendTo(center);
        readImage(memberPic, pic);
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