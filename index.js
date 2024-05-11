$(document).ready(function() {

    var ton = true; // Initial sound state, where 'true' means sound is on.
    var audios = [
        new Audio('audio/Willkommen.mp3'),
        new Audio('audio/Navigation.mp3'),
        new Audio('audio/Ziel.mp3'),
        new Audio('audio/Teamformation.mp3'),
        new Audio('audio/Spielvorbereitung.mp3'),
        new Audio('audio/Spielablauf.mp3'),
        new Audio('audio/Fairplay.mp3'),
        new Audio('audio/Spielende.mp3'),
        new Audio('audio/Kategorie.mp3'),
        new Audio('audio/Erklären.mp3'),
        new Audio('audio/Zeichnen.mp3'),
        new Audio('audio/Geraeusch.mp3'),
        new Audio('audio/StillePost.mp3'),
        new Audio('audio/Stoppuhr.mp3'),
        new Audio('audio/VielSpass.mp3'),
    ];

    var currentAudioIndex = 0; // Starting index


//// Popup ///////////////////////////////////////////////////////////////

    // Zeigt das Popup beim Laden der Seite an
    $('#vorlesePopup').addClass('aktiv');
        
    // Event-Handler für die Buttons
    $('#jaVorlesen').click(function() {
        sessionStorage.setItem('vorlesen', 'true');
        $('#vorlesePopup').removeClass('aktiv');
        playAudio(0);
    });
    
    $('#neinVorlesen').click(function() {
        sessionStorage.setItem('vorlesen', 'false');
        $('#vorlesePopup').removeClass('aktiv');
        $('#ton').attr('src', 'bilder/no-sound.png'); // Path to the sound off image
        $('.tonDiv').addClass('tonFarbeAus');
        stopCurrentAudio(); // Immediately stop the audio if sound is turned off
    });
        


//// Audio ////////////////////////////////////////////////////////////////////////////////


// Funktion zum Abspielen von Audio basierend auf dem aktuellen Index
    function playAudio(index) {
        if (!ton) {
            stopCurrentAudio();
            return; // Frühzeitiger Ausstieg, wenn der Ton ausgeschaltet ist
        }
        stopCurrentAudio(); // Stoppt das aktuelle Audio, bevor das nächste abgespielt wird
        currentAudioIndex = index; // Aktualisiert den Index

        // Überprüft, ob ein spezifischer Index vorhanden ist. Wenn nicht, starte von Anfang an.
        if (index === undefined) {
            currentAudioIndex = 0; // Setzt den Index auf den Anfang, wenn er nicht definiert ist
        }

        // Abspielen des neuen Audios
        audios[currentAudioIndex].play();

        // Event Listener für das Ende der aktuellen Audiospur
        audios[currentAudioIndex].onended = function() {
            // Überprüft, ob dies die letzte Audiospur ist
            if (currentAudioIndex + 1 < audios.length) {
                // Geht zur nächsten Spur, wenn verfügbar
                playAudio(currentAudioIndex + 1);
            }
        };
    }
/////////////////////////////

    // Function to stop the currently playing audio
    function stopCurrentAudio() {
        audios[currentAudioIndex].pause(); // Pause the current audio
        audios[currentAudioIndex].currentTime = 0; // Reset time
    }

    // Keyboard event for navigating between audios
    $(document).keydown(function(e) {
        switch(e.key) {
            case 'ArrowRight': // Right arrow key
                var nextIndex = (currentAudioIndex + 1) % audios.length; // Next index, cyclic
                playAudio(nextIndex);
                break;
            case 'ArrowLeft': // Left arrow key
                var prevIndex = (currentAudioIndex - 1 + audios.length) % audios.length; // Previous index, cyclic
                playAudio(prevIndex);
                break;
        }
    });

    // Automatically play the first sound when the webpage opens
    playAudio(0); // This now correctly sits inside the document ready function

    // Function for sound toggle button
    $('#ton').click(function() {
        ton = !ton; // Toggle sound state

        if (ton) {
            $(this).attr('src', 'bilder/volume.png'); // Path to the sound on image
            $('.tonDiv').removeClass('tonFarbeAus');
            playAudio(currentAudioIndex); // Resume playing the current audio if sound is turned back on
        } else {
            $(this).attr('src', 'bilder/no-sound.png'); // Path to the sound off image
            $('.tonDiv').addClass('tonFarbeAus');
            stopCurrentAudio(); // Immediately stop the audio if sound is turned off
        }
    });

    // Function for sound toggle button mit tastertur -> m 
    $(document).keydown(function(e) {
        if (e.key === "m" || e.key === "M") { // Reagiert auf "M" oder "m"
            $('#ton').click(); // Simuliert einen Klick auf den Toggle-Button
        }
    });
            




//// Timer //////////////////////////////////////////////////////////////////////////////////////////////////

    var startTime = 30; // Startzeit in Sekunden
    var time = startTime * 100; // Umrechnung in Zehntelsekunden für die Anzeige
    var timer;

    var backgroundMusic = new Audio('audio/hintergrundmusik.mp3');

    
    // Funktion zum Aktualisieren der Timer-Anzeige, nur mit Sekunden und Zehntelsekunden
    function updateDisplay(time) {
        var seconds = Math.floor(time / 100);
        var tenths = Math.floor((time % 100) / 10); // Extrahiert Zehntelsekunden

        var formattedTime = 
            (seconds < 10 ? "0" : "") + seconds + ":" + tenths + "0 Sek."; // Zeigt nur Zehntelsekunden an
        $("#timerDisplay").text(formattedTime);
    }


    // Funktion zum Starten des Timers
    var timerStarted = false;

    function startTimer() {
        if (time !== 0 && !timer) { // Überprüfe, ob der Timer nicht bereits läuft
        
            // Soundlogik
            if (!timerStarted) {

                if(ton == true){
                    soundUhr('1'); // Spiele Sound 1 ab
                    setTimeout(function() {
                        backgroundMusic.currentTime = 0; // Setzt die Hintergrundmusik zurück
                        backgroundMusic.play(); // Startet die Hintergrundmusik 
                    }, 500); 
                    timerStarted = true; // Markiere, dass der Timer gestartet wurde
                }
                else{
                    timerStarted = true; // Markiere, dass der Timer gestartet wurde
                }

            
            } else {
                soundUhr('3'); // Spiele Sound 3 ab bei jedem weiteren Start
                backgroundMusic.play(); // Startet die Hintergrundmusik erneut
            }
            
            timer = setInterval(function() {
            time--;
            updateDisplay(time);

            if (time <= 0) {
                timerStarted = false;
                backgroundMusic.pause(); 
                clearInterval(timer);

                seconds = 0;
                tenths = 0;
        

                timer = null; // Setze den Timer zurück, damit er neu gestartet werden kann
                flackern();
                soundUhr('4'); // Spiele den Sound ab, wenn die Zeit abgelaufen ist
                }
            }, 10); // Aktualisiere alle 10 Millisekunden
        }
    }
            
    // Funktion zum Stoppen des Timers
    function stopTimer() {
        clearInterval(timer);
        timer = null;
        soundUhr('2');
        backgroundMusic.pause(); // Pausiert die Hintergrundmusik
    }
        
    // Funktion zum Neustarten des Timers
    function restartTimer() {
        $(".uhr").removeClass("abgelaufen");
        clearInterval(timer);
        timer = null;
        soundUhr('5');
        backgroundMusic.pause(); // Pausiert die Hintergrundmusik
     

        time = startTime * 100; // Zurücksetzen auf Startzeit in Zehntelsekunden
        updateDisplay(time);
        timerStarted = false;
    }
        
    // Event-Handler für die Buttons
    $("#startButton").click(startTimer);
    $("#breakButton").click(stopTimer);
    $("#restartButton").click(restartTimer);

    // Tastertur Funkton Stoppuhr
    $(document).keydown(function(e) {
        switch(e.key) {
            case ' ': // Leertaste = Start/Stop
                if (timer) {
                    stopTimer();
                } else {
                    startTimer();
                }
                break;
            case 'Enter': // Enter-Taste = Restart
                restartTimer();
                break;
        }
    });        

    // Initialisiere die Timer-Anzeige
    updateDisplay(time);

    // Flackern wenn stoppuhr abgelaufen 
    function flackern() {
        setTimeout(function() {
            $(".uhr").addClass("abgelaufen");
            setTimeout(function() {
                $(".uhr").removeClass("abgelaufen");
                
                // Zweiter Flackern-Zyklus
                setTimeout(function() {
                    $(".uhr").addClass("abgelaufen");
                    setTimeout(function() {
                        $(".uhr").removeClass("abgelaufen");
                        
                        // Dritter Flackern-Zyklus
                        setTimeout(function() {
                            $(".uhr").addClass("abgelaufen");
                        
                        }, 200); // Warte zusätzlich, um den Effekt sichtbar zu machen
                    }, 200);
                }, 200); // Warte zusätzlich, um den Effekt sichtbar zu machen
            }, 200);
        }, 200); // Erste Verzögerung vor dem Start
    }


    // Sprachtext Uhr
    function soundUhr(key){

        if (!ton) return; // Wenn ton false ist, beende die Funktion frühzeitig.

        switch (key) {
            case '1':
                var start  = new Audio('audio/Start.mp3'); 
                start.play();
                break;
            case '2':
                var stopp = new Audio('audio/Stopp.mp3'); 
                stopp.play();
                break;
            case '3':
                var weiter = new Audio('audio/Weiter.mp3'); 
                weiter.play();
                break;
            case '4':
                var abgelaufen = new Audio('audio/Abgelaufen.mp3'); 
                abgelaufen.play();
                break;
            case '5':
                var restart = new Audio('audio/Restart.mp3'); 
                restart.play();                
                break;

            default: console.log("Something went wrong!")
        }
    }

});


  

// To Do: 

// - Bilder Kathegorien







