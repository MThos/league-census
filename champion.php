<!doctype html>
<html lang="en">
<head>
    <title>LOL Census</title>
    <meta charset="utf-8">
    <meta name="description" content="LOL Census">
    <meta name="author" content="Mykel Agathos">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inconsolata|Syncopate">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.0/themes/smoothness/jquery-ui.css">
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
                <img id="modal-logo" alt="Logo" src="images/logo-L.png">
                <h4 class="modal-title">LOGIN</h4>
            </div>
            <div class="modal-body">
                <p style="border-top:4px ridge #424242;">Please login below</p>
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
                <img id="modal-logo" alt="Logo" src="images/logo-L.png">
                <h4 class="modal-title">SIGN-UP</h4>
            </div>
            <div class="modal-body">
                <p style="border-top:4px ridge #424242;">Please sign-up below</p>
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
                    <p style="padding-top:25px;padding-bottom:20px;">By signing up, you agree to our <br />
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

<!-- nav bar -->
<nav class="navbar navbar-fixed-top navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="../index.php">
                <img id="nav-logo" alt="Logo" src="images/logo-L.png">
            </a>
            <ul class="nav navbar-nav">
                <li><a href="news.php" class="hvr-pulse-grow">
                        <span class="glyphicon glyphicon-share-alt"></span> LEAGUE NEWS
                    </a>
                </li>
                <li><a href="summoner.php" class="hvr-pulse-grow">
                        <span class="glyphicon glyphicon-share-alt"></span> SUMMONERS
                    </a>
                </li>
                <li class="active"><a href="champion.php" class="hvr-pulse-grow">
                        <span class="glyphicon glyphicon-share-alt"></span> CHAMPIONS
                        <span class="sr-only">(current)</span>
                    </a>
                </li>
                <li><a href="items.php" class="hvr-pulse-grow">
                        <span class="glyphicon glyphicon-share-alt"></span> ITEMS
                    </a>
                </li>
            </ul>
        </div>
        <ul class="nav navbar-nav navbar-right">
            <li><a href="#" data-toggle="modal" data-target="#signup-modal" class="hvr-pulse-grow">
                    <span class="glyphicon glyphicon-new-window"></span> SIGNUP
                </a>
            </li>
            <li><a href="#" data-toggle="modal" data-target="#login-modal" class="hvr-pulse-grow">
                    <span class="glyphicon glyphicon-log-in"></span> LOGIN
                </a>
            </li>
        </ul>
    </div>
</nav>

<!-- header -->
<header class="jumbotron" id="jumbotron-header">
    <div class="text-center">
        <img id="header-img" src="images/league-banner6.png">
    </div>
</header>

<!-- main content -->
<main id="main-content">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/1000hz-bootstrap-validator/0.11.5/validator.js"></script>
    <script src="js/versions.js"></script>
    <script src="js/chart.js"></script>
    <script src="js/champion.js"></script>
    <script src="js/lolcensus.js"></script>
    <div id="search-box">
        <div id="search-textbox" class="ui-widget">
            <input type="text" name="searchedName" id="searchedName" placeholder="Search Champion">
        </div>
        <div id="search-img">
            <img id="search-icon" src="images/search-icon.png" alt="Search" width="38" height="38"
                 onclick="loadChampionData(searchedName.value)" />
        </div>
    </div>
    <div id="main-section">
        <!-- run loadChampionList() -->
        <script>
            loadChampionList();
        </script>
        <a href="#" class="back-to-top"></a>
    </div>
</main>

<!-- footer -->
<footer class="footer navbar-fixed-bottom text-center" id="footer">
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

</body>
</html>