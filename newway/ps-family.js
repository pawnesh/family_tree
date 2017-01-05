/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function($) {
    var rootDiv = '';
    var treeGround = null;
    var family = [];

    $.fn.pk_family = function(options) {
        if (rootDiv == null) {
            jQuery.error('wrong id given');
            return;
        }
        rootDiv = this;
        var div = $('<div>').attr('id','treeGround')
        init();
    }

    function init(){
        addBreadingGround();
        inintalizeBlankFamily();
        if(family.length > 0){
            var html = "<ul>"+renderFamily(family[0])+"</ul>";
            $(treeGround).html(html);
        }else{
            createNewMemberForm();
        }
    }
     function addBreadingGround() {
        var member = $('<div>').attr('id', 'treeGround');
        $(member).attr('class', 'tree-ground');
        $(member).appendTo(rootDiv);
        treeGround = member;
        $(treeGround).draggable();
    }
    function inintalizeBlankFamily(){
        family.push({ id: 0, name: "test one", gender: "M", age: "34", pic: "images/profile.png"});
        addMember({ id: -1, name: "child one", gender: "M", age: "34", pic: "images/profile.png"},0,'child');
        addMember({ id: -1, name: "child two", gender: "M", age: "34", pic: "images/profile.png"},0,'child');
        addMember({ id: -1, name: "child three", gender: "M", age: "34", pic: "images/profile.png"},0,'child');
        addMember({ id: -1, name: "father one", gender: "M", age: "34", pic: "images/profile.png"},0,'father');
        addMember({ id: -1, name: "spouse one", gender: "F", age: "34", pic: "images/profile.png"},0,'spouse');
        addMember({ id: -1, name: "mother one", gender: "F", age: "34", pic: "images/profile.png"},0,'mother');
        addMember({ id: -1, name: "sister one", gender: "F", age: "34", pic: "images/profile.png"},0,'sibling');
        addMember({ id: -1, name: "brother one", gender: "M", age: "30", pic: "images/profile.png"},0,'sibling');
        console.log(family);
        return;
    }
    
    function renderFamily(member){
        if(member.length <= 0){
            return;
        }
        html =  "<li>";
        html = html + getMemberHTML(member,false);
        
        if(member.spouse){
            html = html + getMemberHTML(family[member.spouse],true);
        }
        
        if(member.child){
             html = html + '<ul>';
            for(var i=0;i< member.child.length;i++){
                html = html + renderFamily(family[member.child[i]]);
            }
             html = html + '</ul>';
        }
        html = html + "</li>";
        if(member.sibling){
           for(var i=0;i< member.sibling.length;i++){
                html = html + renderFamily(family[member.sibling[i]]);
            }
        }
        return html;
    }
    
    function getMemberHTML(member,isSpouse){
        var classHTML = "";
        if(isSpouse){
            classHTML = ' class="spouse" ';
        }
        var html = '<a href="#" data-name="'+member.name+'" data-gender="'+member.gender+'" data-age="'+member.age+'" data-relation="" '+classHTML+'><center><img src="'+member.pic+'"><br><span>'+member.name+' ('+member.gender+')</span></center></a>';
        return html;
    }
    
    function addMember(member,to,relation){
        family.push(member);
        var newMemberId = family.length -1;
        family[newMemberId].id = newMemberId;
        
        if(relation == 'child' || relation == 'sibling'){
            if(typeof family[to][relation] == "undefined" || family[to][relation] == null){
                family[to][relation] = [];
            }
            family[to][relation].push(newMemberId);
        }else{
            family[to][relation] = newMemberId;
        }
    }
    
    function createNewMemberForm(){
        
    }
   

}(jQuery));
