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
            $('#pk-family-tree').pk_family();
     </script>
    ```
4. Done. At start it will ask you for entering first member.