<!DOCTYPE html>
<html lang="en">
<head>
    <title>LOL Census</title>
    <meta charset="utf-8">
    <meta name="description" content="LOL Census">
    <meta name="author" content="Mykel Agathos">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Jura:500|Syncopate">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/stylesheet.css">
    <link rel="stylesheet" href="css/hover.css">
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
                <img id="modal-logo" alt="Logo" src="images/logo3.png">
                <h4 class="modal-title">LOGIN</h4>
            </div>
            <div class="modal-body">
                <p style="border-top:4px ridge #424242;">Please enter your credentials below</p>
                <form data-toggle="validator" role="form">
                    <div class="form-group has-feedback">
                        <div class="input-group" id="modal-signup-email">
                            <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span>
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
                    <p style="padding-top:25px;padding-bottom:20px;">
                        <a href="#">I forgot my password?</a>
                    </p>
                    <div class="modal-footer">
                        <div class="form-group">
                            <a href="#">
                                <button type="submit" class="btn btn-primary" id="modal-next">
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
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                <span class="glyphicon glyphicon-remove"></span>
            </button>
            <div class="modal-header">
                <img id="modal-logo" alt="Logo" src="images/logo3.png">
                <h4 class="modal-title">SIGNUP</h4>
            </div>
            <div class="modal-body">
                <p style="border-top:4px ridge #424242;">Please enter your credentials below</p>
                <form data-toggle="validator" role="form">
                    <div class="form-group has-feedback">
                        <div class="input-group" id="modal-signup-email">
                            <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span>
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
                    <p style="padding-top:25px;padding-bottom:20px;">By signing up, you agree to our <br>
                        <a href="terms.php">terms of service</a> and
                        <a href="privacy.php">privacy policy</a>
                    </p>
                    <div class="modal-footer">
                        <div class="form-group">
                            <a href="#">
                                <button type="submit" class="btn btn-primary" id="modal-next">
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

<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">
                <img id="logo" alt="Logo" src="images/logo3.png">
            </a>
            <ul class="nav navbar-nav">
                <li class="active"><a href="index.php">
                        <span class="glyphicon glyphicon-share-alt"></span> HOME
                        <span class="sr-only">(current)</span></a></li>
                <li><a href="services.php">
                        <span class="glyphicon glyphicon-share-alt"></span> SERVICES</a></li>
                <li><a href="about.php">
                        <span class="glyphicon glyphicon-share-alt"></span> ABOUT</a></li>
                <li><a href="contact.php">
                        <span class="glyphicon glyphicon-share-alt"></span> CONTACT</a></li>
            </ul>
        </div>
        <ul class="nav navbar-nav navbar-right">
            <li><a href="#" data-toggle="modal" data-target="#signup-modal">
                    <span class="glyphicon glyphicon-new-window"></span> SIGNUP</a></li>
            <li><a href="#" data-toggle="modal" data-target="#login-modal">
                    <span class="glyphicon glyphicon-log-in"></span> LOGIN</a></li>
        </ul>
    </div>
</nav>

<header class="jumbotron" id="jumbotron-header">
    <div class="container text-center">
        <h1 style="font-weight:bold;">My/Company<span class="glyphicon glyphicon-registration-mark"
                                                      style="font-size:16px;"></span></h1>
        <p>A quick motto or mission statement..</p>
    </div>
</header>
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

<footer class="container-fluid text-center" id="footer">
    Copyright &copy; <?php echo date("Y") ?> | LOLCENSUS.COM | All Rights Reserved |
    <a href="terms.php">Terms of Service</a> |
    <a href="privacy.php">Privacy Policy</a> |
    <a href="contact.php">Contact</a>
    <br><br>
    <p>
        LOLCENSUS isn't endorsed by Riot Games and doesn't reflect the views or opinions of
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