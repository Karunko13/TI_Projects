<?php
  
//require 'vendor/autoload.php' ;

class db {
    private $user = "9nizio" ;
    private $pass = "pass9nizio";
    private $host = "172.20.44.25";
    private $base = "9nizio";

    private $usersColl = "klient";
    private $usersCollection;
    private $sessionColl = "sesja";
    private $sessionCollection;
    private $surveyColl = "ankieta";
    private $surveyCollection;
    private $conn;
    private $dbase;
    
    function __construct() {
      $this->conn = new MongoDB\Client("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");    
      $this->usersCollection = $this->conn->{$this->base}->{$this->usersColl};
      $this->sessionCollection = $this->conn->{$this->base}->{$this->sessionColl};
      $this->surveyCollection = $this->conn->{$this->base}->{$this->surveyColl};
    }
  
    function Read() {
      $cursor = $this->surveyCollection->find();
      $table = iterator_to_array($cursor);
      return $table ;
    }

    function NowyUzytkownik($user){
      $cursor = $this->usersCollection->find(array('login' => $user['login']));
      $flag = iterator_to_array($cursor);
      if(empty($flag)){
        $ret = $this->usersCollection->insertOne($user) ;
        return $ret;
      }else{
        return false;
      }
    }

    function Login($user){
      $cursor = $this->usersCollection->find(array('login' => $user['login'], 'pass' => $user['pass']));
      $flag = iterator_to_array($cursor);
      if(empty($flag)){
        return false;
      }else{
        return true;
      }
    }

    function DodajOdpowiedzi($answers){
      $ret = $this->surveyCollection->insertOne($answers) ;
      return $ret;
    }

    function NewSession($user){
      $unique = uniqid();
      $ret = $this->sessionCollection->insertOne(array('token' => $unique, 'login' => $user['login'], 'start' => time())) ;
      return $unique;
    }


}
?>