<?php
$tree = (isset($_POST['tree']) AND !empty($_POST['tree']))?$_POST['tree']:"";

$tree = json_decode($tree, true);

print_r($tree);
