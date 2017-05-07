Family Tree
===========

jQuery plugin for creating a family tree

Features:

1. Draggable tree, so that you can draw a wide family tree
2. On right click access to option menu.
3. View data of exiting member.
4. Add new member.
5. Remove existing member from tree.



How to:
-----------------------------------------------------------
1. You have to include following file

 ```html
    <link rel="stylesheet" href="jquery-ui.css">
    <script src="jquery-1.11.0.js"></script>
    <script src="jquery-ui.js"></script>
    <script src="ps-family.js"></script>
    <link rel="stylesheet" href="style.css"/>
```
2. Create div in which tree will be display
     ```html
        <div id="pk-family-tree"></div>
    ```
3. Include below query just after the above div 
    ```html
     <script>
            var pkFamily = $('#pk-family-tree').pk_family({referenceVar:'pkFamily'});
     </script>
    ```
4. Done. At start it will ask you for entering first member.

5. To send data of tree to server:
    ```html
    $.send_Family({url: 'save_family.php'})
    ```
   here url is the server file where you want to send family tree
Note: tree data will be in JSON format and will be send through GET method

6. To display tree from preexist tree:
    ```html    
    var family_mem = [];
    ```
    ```html
     family_mem.push({id: 0, name: "test one", gender: "M", age: "34", pic: "img/profile.png"});
   ```
   ```html
     var pkFamily = $('#pk-family-tree').pk_family({referenceVar:'pkFamily', family: family_mem});
   ```
Note: referenceVar is the variable name you assign. in our case "var pkFamily" it is
