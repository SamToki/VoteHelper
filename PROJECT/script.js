// For SamToki.github.io/VoteHelper

// Initialization
    // Variables Declaration
    "use strict";
    var Looper = 0, Percentage = 0, Percentage2 = 0,
    Vote = {
        CandidateQty: 6,
        Total: 50,
        Elapsed: [0,0,0,0,0,0,0],
        ElapsedSum: 0,
        Text: {
            Title: "",
            Candidate1Name: "",
            Candidate2Name: "",
            Candidate3Name: "",
            Candidate4Name: "",
            Candidate5Name: "",
            Candidate6Name: "",
            Note: ""
        }
    };

    // Load Configuration
    window.onload = function() {
        if(localStorage.System) {System = JSON.parse(localStorage.getItem("System"));}
        RefreshSystem();
        if(localStorage.VoteHelper_Vote) {Vote = JSON.parse(localStorage.getItem("VoteHelper_Vote"));}
        RefreshVote();
    };

// Refresh
    // System
    function RefreshSystem() {
        // Settings
            // Display
            ChangeValue("Combobox_SettingsDisplayTheme", System.Display.Theme);
            switch(System.Display.Theme) {
                case "Auto":
                default:
                    document.getElementById("ThemeVariant_Common").href = "../common-Dark.css";
                    document.getElementById("ThemeVariant_Common").media = "(prefers-color-scheme: dark)";
                    document.getElementById("ThemeVariant_Style").href = "style-Dark.css";
                    document.getElementById("ThemeVariant_Style").media = "(prefers-color-scheme: dark)";
                    break;
                case "Default":
                    document.getElementById("ThemeVariant_Common").href = "";
                    document.getElementById("ThemeVariant_Common").media = "";
                    document.getElementById("ThemeVariant_Style").href = "";
                    document.getElementById("ThemeVariant_Style").media = "";
                    break;
                case "Dark":
                    document.getElementById("ThemeVariant_Common").href = "../common-Dark.css";
                    document.getElementById("ThemeVariant_Common").media = "";
                    document.getElementById("ThemeVariant_Style").href = "style-Dark.css";
                    document.getElementById("ThemeVariant_Style").media = "";
                    break;
                case "Genshin":
                    document.getElementById("ThemeVariant_Common").href = "../common-Genshin.css";
                    document.getElementById("ThemeVariant_Common").media = "";
                    document.getElementById("ThemeVariant_Style").href = "style-Genshin.css";
                    document.getElementById("ThemeVariant_Style").media = "";
                    break;
                case "HighContrast":
                    document.getElementById("ThemeVariant_Common").href = "../common-HighContrast.css";
                    document.getElementById("ThemeVariant_Common").media = "";
                    document.getElementById("ThemeVariant_Style").href = "style-HighContrast.css";
                    document.getElementById("ThemeVariant_Style").media = "";
                    break;
            }
            ChangeValue("Combobox_SettingsDisplayCursor", System.Display.Cursor);
            switch(System.Display.Cursor) {
                case "Default":
                default:
                    ChangeCursorOverall("");
                    break;
                case "BTRAhoge":
                    ChangeCursorOverall("url(../cursors/BTRAhoge.cur), auto");
                    break;
                case "Genshin":
                    ChangeCursorOverall("url(../cursors/Genshin.cur), auto");
                    break;
                case "GenshinNahida":
                    ChangeCursorOverall("url(../cursors/GenshinNahida.cur), auto");
                    break;
                case "GenshinFurina":
                    ChangeCursorOverall("url(../cursors/GenshinFurina.cur), auto");
                    break;
            }
            ChangeChecked("Checkbox_SettingsDisplayShowTopbar", System.Display.ShowTopbar);
            if(System.Display.ShowTopbar == true) {
                ChangeShow("Topbar");
                ChangeShow("SectionTitleBelowTopbar");
                ChangeHeight("ViewportBelowTopbar", "");
            } else {
                ChangeHide("Topbar");
                ChangeHide("SectionTitleBelowTopbar");
                ChangeHeight("ViewportBelowTopbar", "100%");
            }
            ChangeValue("Combobox_SettingsDisplayAnimSpd", System.Display.Anim.Spd);
            ChangeAnimSpdOverall(System.Display.Anim.Spd);

            // Dev
            ChangeChecked("Checkbox_SettingsDevShowAllBorders", System.Dev.ShowAllBorders);
            ChangeShowAllBorders(System.Dev.ShowAllBorders);

        // Save Configuration
        localStorage.setItem("System", JSON.stringify(System));
    }

    // Vote
    function RefreshVote() {
        // Main
        for(Looper = 1; Looper <= Vote.CandidateQty; Looper++) {
            ChangeDisabled("Cmdbtn_VoteCandidate" + Looper, false);
            ChangeShow("CtrlGroup_VoteCandidate" + Looper);
            ChangeHeight("CtrlGroup_VoteCandidate" + Looper, "calc(100% / " + Vote.CandidateQty + ")");
            ChangeDisabled("Dropbtn_VoteUndo" + Looper, false);
            ChangeShow("Dropctrl_VoteUndo" + Looper);
        }
        for(Looper = 6; Looper > Vote.CandidateQty; Looper--) {
            Vote.Elapsed[Looper] = 0;
            ChangeDisabled("Cmdbtn_VoteCandidate" + Looper, true);
            ChangeHide("CtrlGroup_VoteCandidate" + Looper);
            ChangeDisabled("Dropbtn_VoteUndo" + Looper, true);
            ChangeHide("Dropctrl_VoteUndo" + Looper);
        }
        Vote.ElapsedSum = 0;
        for(Looper = 1; Looper <= 6; Looper++) {
            Vote.ElapsedSum = Vote.ElapsedSum + Vote.Elapsed[Looper];
        }
        for(Looper = 1; Looper <= 6; Looper++) {
            if(Vote.ElapsedSum == 0) {
                Percentage = 0;
                Percentage2 = 0;
            } else {
                Percentage = Vote.Elapsed[Looper] / Vote.ElapsedSum * 100;
                Percentage2 = Vote.Elapsed[Looper] / Math.max(...Vote.Elapsed) * 100;
            }
            ChangeText("ProgbarText1_VoteCandidate" + Looper, Vote.Elapsed[Looper]);
            ChangeText("ProgbarText2_VoteCandidate" + Looper, Percentage.toFixed(2) + "%");
            ChangeWidth("ProgbarFg_VoteCandidate" + Looper, "calc(20px + (100% - 20px) * " + (Percentage2 / 100) + ")");
        }
        if(Vote.ElapsedSum == 0) {
            Percentage = 0;
        } else {
            Percentage = Vote.ElapsedSum / Vote.Total * 100;
        }
        ChangeText("ProgringText_Vote", Percentage.toFixed(0) + "%");
        ChangeProgring("ProgringFg_Vote", 289.03 * (100 - Percentage) / 100);
        ChangeText("Label_VoteElapsed", Vote.ElapsedSum);
        ChangeText("Label_VoteTotal", "/" + Vote.Total);
        for(Looper = 1; Looper <= 6; Looper++) {
            if(Vote.Elapsed[Looper] <= 0) {
                ChangeDisabled("Dropbtn_VoteUndo" + Looper, true);
            }
        }

        // Check vote completion.
        if(Vote.ElapsedSum >= Vote.Total) {
            Vote.ElapsedSum = Vote.Total;
            for(Looper = 1; Looper <= 6; Looper++) {
                ChangeDisabled("Cmdbtn_VoteCandidate" + Looper, true);
            }
            ChangeText("ProgringText_Vote", "完成");
        }

        // Text
        ChangeValue("Textbox_VoteTitle", Vote.Text.Title);
        ChangeValue("Textbox_VoteCandidate1Name", Vote.Text.Candidate1Name);
        ChangeValue("Textbox_VoteCandidate2Name", Vote.Text.Candidate2Name);
        ChangeValue("Textbox_VoteCandidate3Name", Vote.Text.Candidate3Name);
        ChangeValue("Textbox_VoteCandidate4Name", Vote.Text.Candidate4Name);
        ChangeValue("Textbox_VoteCandidate5Name", Vote.Text.Candidate5Name);
        ChangeValue("Textbox_VoteCandidate6Name", Vote.Text.Candidate6Name);
        ChangeValue("Textbox_VoteNote", Vote.Text.Note);

        // Settings
            // Vote
            ChangeValue("Textbox_SettingsVoteCandidateQty", Vote.CandidateQty);
            ChangeValue("Textbox_SettingsVoteTotal", Vote.Total);
        
        // Save Configuration
        localStorage.setItem("VoteHelper_Vote", JSON.stringify(Vote));
    }

// Commands
    // Vote
    function VoteCount(Selector) {
        if((Vote.CandidateQty >= Selector) && (Vote.ElapsedSum < Vote.Total)) {
            Vote.Elapsed[Selector]++;
        }
        RefreshVote();
    }
    function VoteUndo(Selector) {
        if((Vote.CandidateQty >= Selector) && (Vote.Elapsed[Selector] >= 1)) {
            Vote.Elapsed[Selector]--;
        }
        RefreshVote();
    }
    function VoteReset() {
        for(Looper = 1; Looper <= 6; Looper++) {
            Vote.Elapsed[Looper] = 0;
        }
        RefreshVote();
    }
    function VoteTextSave() {
        Vote.Text.Title = ReadValue("Textbox_VoteTitle");
        Vote.Text.Candidate1Name = ReadValue("Textbox_VoteCandidate1Name");
        Vote.Text.Candidate2Name = ReadValue("Textbox_VoteCandidate2Name");
        Vote.Text.Candidate3Name = ReadValue("Textbox_VoteCandidate3Name");
        Vote.Text.Candidate4Name = ReadValue("Textbox_VoteCandidate4Name");
        Vote.Text.Candidate5Name = ReadValue("Textbox_VoteCandidate5Name");
        Vote.Text.Candidate6Name = ReadValue("Textbox_VoteCandidate6Name");
        Vote.Text.Note = ReadValue("Textbox_VoteNote");
        RefreshVote();
    }

    // Settings
        // Vote
        function SetVoteCandidateQty() {
            Vote.CandidateQty = parseInt(Number(ReadValue("Textbox_SettingsVoteCandidateQty"))); // Use parseInt(Number()) to force convert value to integer.
            if(Vote.CandidateQty < 1) {
                Vote.CandidateQty = 1;
            }
            if(Vote.CandidateQty > 6) {
                Vote.CandidateQty = 6;
            }
            RefreshVote();
        }
        function SetVoteTotal() {
            Vote.Total = parseInt(Number(ReadValue("Textbox_SettingsVoteTotal")));
            if(Vote.Total < 5) {
                Vote.Total = 5;
            }
            if(Vote.Total > 9999) {
                Vote.Total = 9999;
            }
            if(Vote.ElapsedSum > Vote.Total) {
                Vote.Total = Vote.ElapsedSum;
            }
            RefreshVote();
        }

        // Display
        function SetDisplayTheme() {
            System.Display.Theme = ReadValue("Combobox_SettingsDisplayTheme");
            RefreshSystem();
        }
        function SetDisplayCursor() {
            System.Display.Cursor = ReadValue("Combobox_SettingsDisplayCursor");
            RefreshSystem();
        }
        function SetDisplayShowTopbar() {
            if(document.getElementById("Checkbox_SettingsDisplayShowTopbar").checked) {
                System.Display.ShowTopbar = true;
            } else {
                System.Display.ShowTopbar = false;
            }
            RefreshSystem();
        }
        function SetDisplayAnimSpd() {
            System.Display.Anim.Spd = ReadValue("Combobox_SettingsDisplayAnimSpd");
            RefreshSystem();
        }

        // Dev
        function SetDevShowAllBorders() {
            if(document.getElementById("Checkbox_SettingsDevShowAllBorders").checked) {
                System.Dev.ShowAllBorders = true;
            } else {
                System.Dev.ShowAllBorders = false;
            }
            RefreshSystem();
        }

// Automations
    // Nothing here.
