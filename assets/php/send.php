<?php 
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];
$subject = $_POST['subject'];

$to = 'contato@q3sistemas.com.br';
$message = 'FROM: '.$name.' Email: '.$email.'Message: '.$message;
$headers = 'From: youremail@domain.com' . "\r\n";
 
if (filter_var($email, FILTER_VALIDATE_EMAIL)) { // this line checks that we have a valid email address
	mail($to, $subject, $message, $headers); //This method sends the mail.
	echo "Seu e-mail foi enviado!"; // success message
} else {
	echo "E-mail inválido, por favor, digite seu e-mail corretamente.";
}

?>