/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function($) {
    var rootDiv = '';
    var family = [];

    $.fn.pk_family = function(options) {
        if (rootDiv == null) {
            jQuery.error('wrong id given');
            return;
        }
        rootDiv = this;
        init();
    }

    function init(){
        inintalizeBlankFamily();
        if(family.length > 0){
            renderFamily();
        }else{
            createNewMemberForm();
        }
    }
    
    function inintalizeBlankFamily(){
        family.push({ id: 0, name: "test one", gender: "M", age: "34", pic: "images/profile.png"});
        addMember({ id: -1, name: "child one", gender: "M", age: "34", pic: "images/profile.png"},0,'child');
        addMember({ id: -1, name: "father one", gender: "M", age: "34", pic: "images/profile.png"},0,'father');
        addMember({ id: -1, name: "spouse one", gender: "F", age: "34", pic: "images/profile.png"},0,'spouse');
        addMember({ id: -1, name: "mother one", gender: "F", age: "34", pic: "images/profile.png"},0,'mother');
        addMember({ id: -1, name: "sister one", gender: "F", age: "34", pic: "images/profile.png"},0,'sibling');
        console.log(family);
        return;
    }
    
    function renderFamily(){
        
    }
    
    function addMember(member,to,relation){
        family.push(member);
        var newMemberId = family.length -1;
        family[newMemberId].id = newMemberId;
        family[to][relation] = newMemberId;
    }
    
    function createNewMemberForm(){
        
    }
   

}(jQuery));
