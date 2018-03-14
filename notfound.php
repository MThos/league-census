<!DOCTYPE html>
<html lang="en">
<head>
	<title>League Census</title>
	<meta charset="utf-8">
	<meta name="description" content="League Census">
	<meta name="author" content="Mykel Agathos">
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
	<link rel="icon" href="favicon.ico" type="image/x-icon"/>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Handlee|Inconsolata"/>
	<!--[if lte IE 9]>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
	<![endif]-->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>
	<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.0/themes/smoothness/jquery-ui.css"/>
	<link rel="stylesheet" href="css/hover.css"/>
	<link rel="stylesheet" href="css/normalize.css"/>
	<link rel="stylesheet" href="css/stylesheet.css"/>
	<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css" />
	<script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>
	<!-- cookie policy -->
	<script src="//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>
	<script>
		window.addEventListener("load", function(){
			window.cookieconsent.initialise({
				"palette": {
					"popup": {
						"background": "#fbc02d"
					},
					"button": {
						"background": "transparent",
						"text": "#000000",
						"border": "#000000"
					}
				},
				"content": {
					"message": "Greetings, Summoner! This website uses cookies to ensure you get the best experience.",
					"dismiss": "GOT IT!",
					"link": "Our Policy",
					"href": "www.leaguecensus.com/cookies"
				}
			});
		});
	</script>
</head>
<body>

	<!-- login modal -->
	<div id="login-modal" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-sm">
			<div class="modal-content">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					<span class="glyphicon glyphicon-remove"></span>
				</button>
				<div class="modal-header">
					<img id="modal-logo" alt="Logo" src="images/logo-L.png">
					<br><br>
					<h4 class="modal-title">LOGIN</h4>
				</div>
				<div class="modal-body">
					<p class="modal-body-info">Please login below</p>
					<form data-toggle="validator" role="form">
						<div class="form-group has-feedback">
							<div class="input-group" id="modal-signup-email">
								<span class="input-group-addon"><i class="far fa-envelope"></i></span>
								<input type="email" class="form-control" id="input-login-email" placeholder="Email"
										data-error="That email address is invalid" required>
							</div>
							<span class="glyphicon form-control-feedback" aria-hidden="true"></span>
							<div class="help-block with-errors"></div>
						</div>
						<div class="form-group has-feedback">
							<div class="input-group" id="modal-signup-pass">
								<span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
								<input type="password" class="form-control" id="input-login-pass" placeholder="Password"
										data-minlength="6" data-error="Minimum of 6 characters" required>
							</div>
							<span class="glyphicon form-control-feedback" aria-hidden="true"></span>
							<div class="help-block with-errors"></div>
						</div>
						<p class="modal-footer-info">
							<a href="#">I forgot my password?</a>
						</p>
						<div class="modal-footer">
							<div class="form-group">
								<a href="#">
									<button type="submit" class="modal-next btn btn-primary">
										<span class="glyphicon glyphicon-chevron-right" id="next-button"></span>
									</button>
								</a>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

	<!-- signup modal -->
	<div id="signup-modal" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-md" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<img id="modal-logo" alt="Logo" src="images/logo-L.png" />
					<h4 class="modal-title">SIGN-UP</h4>
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
						<i class="fas fa-times"></i>
					</button>

				</div>
				<div class="modal-body">
					<p class="modal-body-info">Please sign up below</p>
					<form data-toggle="validator" role="form">
						<div class="form-group has-feedback">
							<div class="input-group" id="modal-signup-email">
								<div class="input-group-prepend">
									<i class="fas fa-envelope fa-fw"></i>
								</div>
								<input type="email" class="form-control" id="input-signup-email" placeholder="Email"
										data-error="That email address is invalid" required>
							</div>
							<span class="glyphicon form-control-feedback" aria-hidden="true"></span>
							<div class="help-block with-errors"></div>
						</div>
						<div class="form-group has-feedback">
							<div class="input-group" id="modal-signup-pass">
								<span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
								<input type="password" class="form-control" id="input-signup-pass" placeholder="Password"
										data-minlength="6" data-error="Minimum of 6 characters" required>
							</div>
							<span class="glyphicon form-control-feedback" aria-hidden="true"></span>
							<div class="help-block with-errors"></div>
						</div>
						<div class="form-group has-feedback">
							<div class="input-group" id="modal-signup-pass-confirm">
								<span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
								<input type="password" class="form-control" id="input-signup-pass-confirm"
										placeholder="Confirm Password" data-match="#input-signup-pass"
										data-match-error="Your passwords don't match">
							</div>
							<span class="glyphicon form-control-feedback" aria-hidden="true"></span>
							<div class="help-block with-errors"></div>
						</div>
						<p class="modal-footer-info">By signing up, you agree to our <br>
							<a href="terms.php">terms of service</a> and
							<a href="privacy.php">privacy policy</a>
						</p>
						<div class="modal-footer">
							<div class="form-group">
								<a href="#">
									<button type="submit" class="modal-next btn btn-primary">
										<span class="glyphicon glyphicon-chevron-right" id="next-button"></span>
									</button>
								</a>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>

	<!-- nav bar -->
	<nav class="navbar fixed-top navbar-inverse">
		<a class="navbar-brand" href="index.php">
			<img id="nav-logo" alt="Logo" src="images/logo-L.png">
		</a>
		<ul class="navbar-nav navbar-left">
			<li class="nav-item"><a href="summoner.php" class="nav-link hvr-pulse-grow">
					<i class="fas fa-share"></i>
					SUMMONERS
				</a>
			</li>
			<li class="nav-item active"><a href="champion.php" class="nav-link hvr-pulse-grow">
					<i class="fas fa-share"></i>
					CHAMPIONS
					<span class="sr-only">(current)</span>
				</a>
			</li>
			<li class="nav-item"><a href="items.php" class="nav-link hvr-pulse-grow">
					<i class="fas fa-share"></i>
					ITEMS
				</a>
			</li>
		</ul>
		<ul class="navbar-nav navbar-right">
			<li class="nav-item"><a href="#" data-toggle="modal" data-target="#signup-modal" class="nav-link hvr-pulse-grow">
					<i class="fas fa-upload"></i>
					SIGNUP
				</a>
			</li>
			<li class="nav-item"><a href="#" data-toggle="modal" data-target="#login-modal" class="nav-link hvr-pulse-grow">
					<i class="fas fa-sign-in-alt"></i>
					LOGIN
				</a>
			</li>
		</ul>
	</nav>

	<!-- header -->
	<header class="jumbotron" id="jumbotron-header">
		<div class="text-center">
			<img id="header-img" src="images/logo-yellow-border.png">
		</div>
	</header>
							
	<!-- main content -->							
	<main id="main-content">
		<?php
		$ip = getenv("REMOTE_ADDR");
		$reqURI = getenv("REQUEST_URI");
		$serverName = getenv("SERVER_NAME");
		$combine = $ip . " tried to load " . $serverName . $reqURI;
		$httpAgent = getenv("HTTP_USER_AGENT");
		$today = date("D M j Y g:i:s A T");
		$message = "<p><span id=\"font-size-30\">Error 404 - Page Not Found</span><br>
		<img src=\"images/404_x.png\" height=\"128\" width=\"128\" alt=\"Not Found\"><br>
		<span id=\"font-size-24\">We must have lost the page you were looking for.. Sorry!</span>
		<br><br><br>
		<strong>Technical Mumbo Jumbo:</strong><br><br>
		$today <br>
		$combine <br>
		User Agent = $httpAgent</p>";
		echo $message;
		?>
	</main>

	<!-- footer -->
	<footer class="footer fixed-bottom text-center" id="footer">
		Copyright &copy; <?php echo date("Y") ?> | LEAGUECENSUS.COM | All Rights Reserved |
		<a href="terms.php">Terms of Service</a> |
		<a href="privacy.php">Privacy Policy</a> |
		<a href="contact.php">Contact</a>
		<br><br>
		<p>
			League Census isn't endorsed by Riot Games and doesn't reflect the views or opinions of
			Riot Games or anyone<br>officially involved in producing or managing League of Legends.
			League of Legends and Riot Games are<br>trademarks or registered trademarks of Riot Games,
			Inc. League of Legends &copy Riot Games, Inc.
		</p>
	</footer>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/1000hz-bootstrap-validator/0.11.5/validator.js"></script>
	</body>
	</html>