/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function ($) {

    $.fn.pk_family = function (options) {
        var familyObj = new pwnFamily(options);
        familyObj.rootDiv = this;
        if (familyObj.rootDiv == null) {
            jQuery.error('wrong id given');
            return;
        }
        familyObj.init();
        return familyObj;
    }

    var pwnFamily = function (options) {
        this.rootDiv = '';
        this.treeGround = null;
        this.family = [];
        this.options_menu = null;
        this.referenceVar = '';
        this.selectedMember = null;
        this.memberFormID = 'pkMemberForm';
        this.oldestMemberId = 0;
        this.addBreadingGround();
        if (options.referenceVar) {
            this.referenceVar = options.referenceVar;
        }
        if (options.family) {
            this.family = options.family;
        }
        return this;
    }
    pwnFamily.prototype = {
        constructor: pwnFamily,
        init: function () {

            this.createOptionsMenu();
            this.addBreadingGround();
            this.createNewMemberForm();


            //~ this.inintalizeBlankFamily();

            if (this.family.length > 0) { // if family already exist then render it
                this.refershFamily();
            } else {
                // show first memeber form
                this.openMemberForm(true);
            }
        },
        refershFamily: function () {
            //~ console.log(this.family);
            this.oldestMemberId = this.getOldestMemberId(0);
            //~ console.log(this.oldestMemberId);
            var html = "<ul>" + this.renderFamily(this.family[this.oldestMemberId]) + "</ul>";
            $(this.treeGround).html(html);
        },
        getOldestMemberId: function (memberIndex) {
            var parentId = -1;
            if (this.family[memberIndex].father) {
                parentId = this.family[memberIndex].father;
            } else if (this.family[memberIndex].mother) {
                parentId = this.family[memberIndex].mother;
            }
            if (parentId != -1) {
                if (this.family[parentId].child && this.family[parentId].child.length > 1) {
                    return this.getOldestMemberId(parentId);
                }
            }
            return this.family[memberIndex].id;
        },
        createOptionsMenu: function () {
            var div = $('<div>').attr('id', 'pk-popmenu');
            var ul = $('<ul>');
            var root = this;
            // add member button
            var liAdd = $('<li>').html('Add Member').appendTo(ul);
            liAdd.click(function (event) {
                root.openMemberForm(true);
                $(root.options_menu).css('display', 'none');
            });
            // view member button
            var liDisplay = $('<li>').html('View Details').appendTo(ul);
            liDisplay.click(function (event) {
                root.openMemberForm(false);
                $(root.options_menu).css('display', 'none');
            });
            // cancel the pop menu
            var liCancel = $('<li>').html('Cancel').appendTo(ul);
            liCancel.click(function (event) {
                $(root.options_menu).hide();
            });
            $(div).append(ul);
            this.options_menu = div;
            $(this.options_menu).appendTo(this.rootDiv);
        },
        openMemberForm: function (isNewMember) {
            if (!isNewMember) {
                $('#pk-isediting').val(1);
                $('#pk-name').val(this.selectedMember.name);
                var gender = 'Male';
                if (this.selectedMember.gender == 'F') {
                    gender = 'Female';
                }
                $('#pk-gender').val(gender);
                $('#pk-age').val(this.selectedMember.age);
                $('#pk-relation').parent().parent().hide();
            } else {
                $('#pk-isediting').val(0);
                $('#pk-relation').parent().parent().show();
            }
            $("#" + this.memberFormID).dialog({width: 482, show: {effect: "slide", duration: 1000}});
        },
        addBreadingGround: function () {
            var member = $('<div>').attr('id', 'treeGround');
            $(member).attr('class', 'tree-ground');
            $(member).appendTo(this.rootDiv);
            this.treeGround = member;
            $(this.treeGround).draggable();
        },
        inintalizeBlankFamily: function () {
            // just for testing
            this.addMember({id: 0, name: "test one", gender: "M", age: "34", pic: "images/profile.png"}, -1, '');
            this.addMember({id: -1, name: "child one", gender: "M", age: "34", pic: "images/profile.png"}, 0, 'child');
            this.addMember({id: -1, name: "child two", gender: "M", age: "34", pic: "images/profile.png"}, 0, 'child');
            this.addMember({id: -1, name: "child three", gender: "M", age: "34", pic: "images/profile.png"}, 0, 'child');
            this.addMember({id: -1, name: "father one", gender: "M", age: "34", pic: "images/profile.png"}, 0, 'father');
            this.addMember({id: -1, name: "spouse one", gender: "F", age: "34", pic: "images/profile.png"}, 0, 'spouse');
            this.addMember({id: -1, name: "mother one", gender: "F", age: "34", pic: "images/profile.png"}, 0, 'mother');
            this.addMember({id: -1, name: "sister one", gender: "F", age: "34", pic: "images/profile.png"}, 0, 'sibling');
            this.addMember({id: -1, name: "brother one", gender: "M", age: "30", pic: "images/profile.png"}, 0, 'sibling');
        },
        renderFamily: function (member) {
            if (member.length <= 0) {
                return;
            }
            html = "<li>";
            html = html + this.getMemberHTML(member, false);
            if (member.spouse) {
                html = html + this.getMemberHTML(this.family[member.spouse], true);
            }

            if (member.child) {
                html = html + '<ul>';
                for (var i = 0; i < member.child.length; i++) {
                    html = html + this.renderFamily(this.family[member.child[i]]);
                }
                html = html + '</ul>';
            }
            html = html + "</li>";
//            if (member.sibling) {
//                for (var i = 0; i < member.sibling.length; i++) {
//                    html = html + this.renderFamily(this.family[member.sibling[i]]);
//                }
//            }
            return html;
        },
        getMemberHTML: function (member, isSpouse) {
            var classHTML = "";
            if (isSpouse) {
                classHTML = ' class="single-member spouse" ';
            } else {
                classHTML = ' class="singel-member" ';
            }
            var html = '<a href="javascript:void(0)" data-id="' + member.id + '" data-name="' + member.name + '" data-gender="' + member.gender + '" data-age="' + member.age + '" data-relation="" ' + classHTML + ' onclick="' + this.referenceVar + '.openMenu(this,event)"><span class="fa fa-close" onclick="' + this.referenceVar + '.removeMember(this)"></span><center><img id="member-picture-' + member.id + '" src="' + member.pic + '"><br><span>' + member.name + ' (' + member.gender + ')</span></center></a>';
            return html;
        },
        readImage: function (input, memberId) {
            var files = $(input).prop('files');
            var root = this;
            if (files && files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    root.family[memberId].pic = e.target.result;
                    $('#member-picture-' + memberId).attr('src', e.target.result);
                }

                reader.readAsDataURL(files[0]);
            }
        },
        removeMember: function (element) {
            console.log("hello");
        },
        addMember: function (member, to, relation) {
            this.family.push(member);
            var newMemberId = this.family.length - 1;
            this.family[newMemberId].id = newMemberId;
            if (to != -1) {
                if (relation == 'child' || relation == 'sibling') {
                    if (typeof this.family[to][relation] == "undefined" || this.family[to][relation] == null) {
                        this.family[to][relation] = [];
                    }
                    this.family[to][relation].push(newMemberId);
                } else {
                    this.family[to][relation] = newMemberId;
                }
                // if father then addin siblings to father child
                if (relation == 'father') {
                    if (this.family[to].mother) {
                        // if mother exist
                        var motherId = this.family[to].mother;
                        this.family[motherId].spouse = newMemberId;
                        for (var i = 0; i < this.family[motherId].child; i++) {
                            this.family[i].father = newMemberId;
                        }
                    } else {
                        // if no mother exist
                        var child = [];
                        if (this.family[to].sibling) {
                            child = this.family[to].sibling;
                            this.family[to].sibling = [];
                        }
                        child.push(to);
                        this.family[newMemberId]['child'] = child;
                    }
                }
                if (relation == 'mother') {
                    if (this.family[to].father) {
                        // if father already exist
                        var fatherId = this.family[to].father;
                        this.family[fatherId].spouse = newMemberId;
                        for (var i = 0; i < this.family[fatherId].child; i++) {
                            this.family[i].mother = newMemberId;
                        }
                    } else {
                        // if no father exist
                        var child = [];
                        if (this.family[to].sibling) {
                            child = this.family[to].sibling;
                            this.family[to].sibling = [];
                        }
                        child.push(to);
                        this.family[newMemberId]['child'] = child;
                    }
                }
                if (relation == 'sibling') {
                    if (this.family[to].father) {
                        // if father already exist
                        var fatherId = this.family[to].father;
                        this.family[fatherId].child.push(newMemberId);
                        this.family[to].sibling = [];
                    }
                }
                if (relation == 'child') {
                    if (this.family[to].gender == 'M') {
                        this.family[newMemberId].father = to;
                    } else {
                        this.family[newMemberId].mother = to;
                    }
                }
            }
            return newMemberId;
        },
        createNewMemberForm: function () {
            var html = '';
            html = '<div id="' + this.memberFormID + '" title="Member Detail"><p>';
            html = html + '<table>';
            html = html + '<tr><td><label>Name</label></td><td><input type="text" value="" id="pk-name"/></td></tr>';
            html = html + '<tr><td><label>Gender</label></td><td><select id="pk-gender"><option value="Male">Male</option><option value="Female">Female</option></select></td></tr>';
            html = html + '<tr><td><label>Age</label></td><td><input type="text" value="" id="pk-age"></td></tr>';
            html = html + '<tr><td class="relations"><label>Relation</label></td><td class="relations"><select id="pk-relation"><option value="mother">Mother</option><option value="father">Father</option><option value="sibling">Sibling</option><option value="child">child</option><option value="spouse">Spouse</option></select></td></tr>';
            html = html + '<tr><td><label>Upload Photo</label></td><td><input type="file" id="pk-picture"></td></tr>';
            html = html + '<tr><td>&nbsp;</td><td><input type="hidden" value="0" id="pk-isediting"/><input type="button" value="Save" onclick="' + this.referenceVar + '.saveMember()"/></td></tr>';
            html = html + '</table>';
            html = html + '</p></div>';
            $(this.rootDiv).append(html);
        },
        saveMember: function () {
            var member = {id: -1, name: "", gender: "", age: "", pic: ""};
            if ($('#pk-isediting').val() == '1') {
                member = this.selectedMember;
                member.name = $('#pk-name').val();
                member.gender = $('#pk-gender').val();
                member.age = $('#pk-age').val();
                this.family[member.id] = member;
            } else {
                member.name = $('#pk-name').val();
                member.gender = $('#pk-gender').val();
                member.age = $('#pk-age').val();
                member.pic = 'images/profile.png';
                if (member.gender == 'Female') {
                    member.gender = 'F';
                    member.pic = 'images/profile-f.png';
                } else {
                    member.gender = 'M';
                }
                var parentId = 0;
                var relation = "";
                if (this.selectedMember != null) {
                    parentId = this.selectedMember.id;
                    relation = $('#pk-relation').val();
                }
                
                var newMemberId = this.addMember(member, parentId, relation);
                this.readImage($('#pk-picture'), newMemberId);
            }
            $('#pk-name').val("");
            $('#pk-gender').val("Male");
            $('#pk-age').val("");
            $('#pk-isediting').val("0");
            this.refershFamily();
            $("#" + this.memberFormID).dialog("close");
        },
        openMenu: function (element, event) {
            this.selectedMember = this.family[$(element).attr('data-id')];
            $(this.options_menu).css('left', event.clientX);
            $(this.options_menu).css('top', event.clientY);
            $(this.options_menu).show();
        }
    }
}(jQuery));
