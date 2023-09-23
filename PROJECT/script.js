// For SamToki.github.io/VoteHelper

// Initialization
"use strict";
var Looper = 0, Percentage = 0, Percentage2 = 0,
Vote = {
    CandidateQty: 6,
    Total: 50,
    Elapsed: [0,0,0,0,0,0,0],
    ElapsedSum: 0
},
System = {
    Appearance: {
        ShowTopbar: true,
        Anim: {
            Spd: "0.3s"
        }
    },
    Dev: {
        ShowAllBorders: false
    }
};

// Refresh
function Refresh() {
    // Vote
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
    ChangeProgring("ProgringFg_Vote", 257.61 * (100 - Percentage) / 100);
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

    // Settings
        // Vote
        ChangeValue("Textbox_SettingsVoteCandidateQty", Vote.CandidateQty);
        ChangeValue("Textbox_SettingsVoteTotal", Vote.Total);

        // Appearance
        ChangeChecked("Checkbox_SettingsAppearanceShowTopbar", System.Appearance.ShowTopbar);
        if(System.Appearance.ShowTopbar == true) {
            ChangeShow("Topbar");
            ChangeShow("SectionTitle_Primary");
            ChangeHeight("Viewport_Primary", "");
        } else {
            ChangeHide("Topbar");
            ChangeHide("SectionTitle_Primary");
            ChangeHeight("Viewport_Primary", "100%");
        }
        ChangeValue("Combobox_SettingsAppearanceAnimSpd", System.Appearance.Anim.Spd);
        ChangeAnimSpd(System.Appearance.Anim.Spd);

        // Dev
        ChangeChecked("Checkbox_SettingsDevShowAllBorders", System.Dev.ShowAllBorders);
        ChangeShowAllBorders(System.Dev.ShowAllBorders);
    
    // Save Configuration
    	// ???
}

// Load
	// Load Configuration
    	// ???
    
    // Refresh
    window.onload = Refresh();

// Commands
    // Vote
    function VoteCount(Selector) {
        if((Vote.CandidateQty >= Selector) && (Vote.ElapsedSum < Vote.Total)) {
            Vote.Elapsed[Selector]++;
        }
        Refresh();
    }
    function VoteUndo(Selector) {
        if((Vote.CandidateQty >= Selector) && (Vote.Elapsed[Selector] >= 1)) {
            Vote.Elapsed[Selector]--;
        }
        Refresh();
    }
    function VoteReset() {
        for(Looper = 1; Looper <= 6; Looper++) {
            Vote.Elapsed[Looper] = 0;
        }
        Refresh();
    }

    // Settings
    function SetVoteCandidateQty() {
        Vote.CandidateQty = parseInt(Number(ReadValue("Textbox_SettingsVoteCandidateQty"))); // Use parseInt(Number()) to force convert value to integer.
        if(Vote.CandidateQty < 1) {
            Vote.CandidateQty = 1;
        }
        if(Vote.CandidateQty > 6) {
            Vote.CandidateQty = 6;
        }
        Refresh();
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
        Refresh();
    }
    function SetAppearanceShowTopbar() {
        if(document.getElementById("Checkbox_SettingsAppearanceShowTopbar").checked) {
            System.Appearance.ShowTopbar = true;
        } else {
            System.Appearance.ShowTopbar = false;
        }
        Refresh();
    }
    function SetAppearanceAnimSpd() {
        System.Appearance.Anim.Spd = ReadValue("Combobox_SettingsAppearanceAnimSpd");
        Refresh();
    }
    function SetDevShowAllBorders() {
        if(document.getElementById("Checkbox_SettingsDevShowAllBorders").checked) {
            System.Dev.ShowAllBorders = true;
        } else {
            System.Dev.ShowAllBorders = false;
        }
        Refresh();
    }

// Automations
    // Nothing here.
