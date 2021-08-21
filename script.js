
// Document has been loaded
$(document).ready(function () {
    // Helper Function to Extract Access Token for URL
    const getUrlParameter = (sParam) => {
        let sPageURL = window.location.search.substring(1),////substring will take everything after the https link and split the #/&
            sURLVariables = sPageURL != undefined && sPageURL.length > 0 ? sPageURL.split('#') : [],
            sParameterName,
            i;
        let split_str = window.location.href.length > 0 ? window.location.href.split('#') : [];
        sURLVariables = split_str != undefined && split_str.length > 1 && split_str[1].length > 0 ? split_str[1].split('&') : [];
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    const ps = new PerfectScrollbar(".music-container", {
        wheelSpeed: 15
    });
    

    // Get Access Token
    const accessToken = getUrlParameter('access_token');

    // AUTHORIZE with Spotify (if needed)
    // *************** REPLACE THESE VALUES! *************************
    let client_id = 'b8668bbbe394492096c71f52a55757e3';
    // Use the following site to convert your regular url to the encoded version:
    // https://www.url-encode-decode.com/
    let redirect_uri = 'https%3A%2F%2Faccounts.spotify.com%2Fauthorize%3Fclient_id%3Db8668bbbe394492096c71f52a55757e3%26response_type%3Dtoken%26redirect_uri%3Dhttps%253A%252F%252Fpalak-kaur.github.io%252FBlynk-Music'; // GitHub Pages URL or whatever your public url to this app is
    // *************** END *************************

    const redirect = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${redirect_uri}`;
    // Don't authorize if we have an access token already
    if (accessToken == null || accessToken == "" || accessToken == undefined) {
        window.location.replace(redirect);
    }

    //HOME =================================================================================
    let category = ["Taylor","motivational", "bollywood", "punjabi", "Pop", "shahrukh", "punjabi love"];
    for (let i = 0; i < category.length; i++) {
        $.ajax({
            url: `https://api.spotify.com/v1/search?q=${category[i]}&type=track`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (data) {
                // Load our songs from Spotify into our page
                let num_of_tracks = data.tracks.items.length;
                let count = 0;


                const max_songs = 8;
                while (count <= max_songs && count <= num_of_tracks) {
                    // Extract the id of the FIRST song from the data object
                    let id = data.tracks.items[count].id;
                    // Constructing two different iframes to embed the song
                    let src_str = `https://open.spotify.com/embed/track/${id}`;
                    let iframe = `<div class='song'><iframe src=${src_str} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`;
                    parent_div =$(`#row-${i} > #song-home_${count}`);
                    parent_div.append(iframe);

                    count++;
                }
            }

        }); // End of Spotify ajax call
    }



    //SEARCH ================================================================================
    let isSearchOpen = false;
    $(".search-nav").click(function (e) {
        if (!isSearchOpen) {
            $(".music-container").hide();
            let searchDiv = `<div class="search-screen" >
                               <div class = "search-bar" contenteditable = "true"> Search </div>
                               <div class="container" id="song-list">
                                    <div class="row">
                                    <div  id="song_0" class="col"></div>
                                    <div id="song_1" class="col"></div>
                                    <div id="song_2" class="col"></div>
                               </div>
                                <div class="row">
                                    <div id="song_3" class="col"></div>
                                    <div id="song_4" class="col"></div>
                                    <div id="song_5" class="col"></div>
                                    </div>
                                <div class="row">
                                    <div id="song_6" class="col"></div>
                                    <div id="song_7" class="col"></div>
                                    <div id="song_8" class="col"></div>
                                </div>
                                <div class="row">
                                    <div id="song_9" class="col"></div>
                                    <div id="song_10" class="col"></div>
                                    <div id="song_11" class="col"></div>
                                    </div>
                                </div>
                           </div>`;

            $(".container").append(searchDiv);
            $(".search-bar").css({ "height": " 5vh", "width": "50vw", "border": "0.5px solid grey", "color": "grey", "border-radius": "25px", "display": "flex", "justify-content": "center", "align-items": "center", "margin": "30px" });
            $(".col").css({ "display": "inline-block !important" });

            $(".search-screen").css({ "background-color": "black", "height": "88vh", "width": "83vw", "display": "flex", "flex-direction": "column", "justify-content": "center", "box-shadow": "0 0 10px grey" });

            $(".search-bar").on('focus', function () {
                $(".search-bar").text("");
                $(".search-bar").on('keypress', function (e) {
                    if (e.which == 13) {
                        //Get the value of the search box
                        let raw_search_query = $(".search-bar").text();
                        console.log(raw_search_query);
                        let search_query = encodeURI(raw_search_query);
                        searchResult(raw_search_query, search_query);
                    }
                });


            });
            isSearchOpen = true;
        }
    });

    function searchResult(raw_search_query, search_query) {

        // Make Spotify API call
        // Note: We are using the track API endpoint.
        $.ajax({
            url: `https://api.spotify.com/v1/search?q=${search_query}&type=track`,
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (data) {
                // Load our songs from Spotify into our page
                let num_of_tracks = data.tracks.items.length;
                let count = 0;

                // Max number of songs is 12
                const max_songs = 12;
                while (count < max_songs && count < num_of_tracks) {
                    // Extract the id of the FIRST song from the data object
                    let id = data.tracks.items[count].id;
                    // Constructing two different iframes to embed the song
                    let src_str = `https://open.spotify.com/embed/track/${id}`;
                    let iframe = `<div class='song'><iframe src=${src_str} frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>`;
                    let parent_div = $('#song_' + count);
                    parent_div.html(iframe);

                    count++;
                }
            }
        }); // End of Spotify ajax call

    }

    $(document).on('keydown', function (event) {
        if (event.key == "Escape" && isSearchOpen) {
            console.log("ok");
            $(".search-screen").remove();
            isSearchOpen = false;
            $(".music-container").show();
        }

    });

}); // End of document.ready


