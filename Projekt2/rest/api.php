<?php
          
require '../vendor/autoload.php' ;        
require_once("rest.php");
require_once("mongo.php");
      
class API extends REST {
      
    public $data = "";
      
    public function __construct(){
        parent::__construct();      
        $this->db = new db() ;            
    }
              
    public function processApi(){
  
        $func = "_".$this->_endpoint ; 
        if((int)method_exists($this,$func) > 0) {
            $this->$func();
              }  else {
            $this->response('Page not found',404); }         
    }
    
    private function _login() {
        if($this->get_request_method() != "POST") {
            $this->response('',406);
        }
        if(!empty($this->_request) ){
            try {
                $json_array = json_decode($this->_request,true);
                $res = $this->db->Login($json_array);
                if ( $res ) {
                    $token = $this->db->NewSession($json_array);
                    $result = array('return'=>'Poprawnie zalogowano w bazie', 'token' => $token);
                    $this->response($this->json($result), 200);
                } else {
                    $result = array('return'=>'Błędne dane logowania. Spróbuj ponownie.');
                    $this->response($this->json($result), 400);
                }
            } catch (Exception $e) {
                $this->response('', 400) ;
            }
        } else {
            $error = array('status' => "Failed", "msg" => "Invalid send data");
            $this->response($this->json($error), 400);
        }
    }

    private function _register() {
        if($this->get_request_method() != "POST") {
            $this->response('',406);
        }
        if(!empty($this->_request) ){
            try {
                $json_array = json_decode($this->_request,true);
                $res = $this->db->NowyUzytkownik($json_array);
                if ( $res ) {
                    $result = array('return'=>'Pomyslnie dodano do bazy');
                    $this->response($this->json($result), 200);
                } else {
                    $result = array('return'=>'Podany login i haslo istnieja w bazie');
                    $this->response($this->json($result), 400);
                }
            } catch (Exception $e) {
                $this->response('', 400) ;
            }
        } else {
            $error = array('status' => "Failed", "msg" => "Invalid send data");
            $this->response($this->json($error), 400);
        }
    }

    private function _add() {
        if($this->get_request_method() != "POST") {
            $this->response('',406);
        }
        if(!empty($this->_request) ){
            try {
                $json_array = json_decode($this->_request,true);
                $res = $this->db->DodajOdpowiedzi($json_array);
                if ( $res ) {
                    $result = array('return'=>'Dodano lokalne odpowiedz do bazy serwera');
                    $this->response($this->json($result), 200);
                } else {
                    $result = array('return'=>'Blad podczas zapisu odpowiedzi');
                    $this->response($this->json($result), 400);
                }
            } catch (Exception $e) {
                $this->response('', 400) ;
            }
        } else {
            $error = array('status' => "Failed", "msg" => "Invalid send data");
            $this->response($this->json($error), 400);
        }
    }

    private function _read(){   
        if($this->get_request_method() != "GET"){
            $this->response('',406);
        }
        $result = $this->db->Read() ;            
        $this->response($this->json($result), 200); 
    }

    private function json($data){
        if(is_array($data)){
            return json_encode($data);
        }
    }
}
          
    $api = new API();
    $api->processApi();
  
?>