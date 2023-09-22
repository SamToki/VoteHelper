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
        Anim: {
            Spd: "0.3s"
        }
    }
};

// Refresh
function Refresh() {
    // Vote
    for(Looper = 1; Looper <= Vote.CandidateQty; Looper++) {
        ChangeEnable("Cmdbtn_VoteCandidate" + Looper);
        ChangeShow("CtrlGroup_VoteCandidate" + Looper);
        ChangeHeight("CtrlGroup_VoteCandidate" + Looper, "calc(100% / " + Vote.CandidateQty + ")");
        ChangeEnable("Dropbtn_VoteUndo" + Looper);
        ChangeShow("Dropctrl_VoteUndo" + Looper);
    }
    for(Looper = 6; Looper > Vote.CandidateQty; Looper--) {
        Vote.Elapsed[Looper] = 0;
        ChangeDisable("Cmdbtn_VoteCandidate" + Looper);
        ChangeHide("CtrlGroup_VoteCandidate" + Looper);
        ChangeDisable("Dropbtn_VoteUndo" + Looper);
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
            ChangeDisable("Dropbtn_VoteUndo" + Looper);
        }
    }

    // Check vote completion.
    if(Vote.ElapsedSum >= Vote.Total) {
        Vote.ElapsedSum = Vote.Total;
        for(Looper = 1; Looper <= 6; Looper++) {
            ChangeDisable("Cmdbtn_VoteCandidate" + Looper);
        }
        ChangeText("ProgringText_Vote", "完成");
    }

    // Settings
        // Vote
        ChangeValue("Textbox_SettingsVoteCandidateQty", Vote.CandidateQty);
        ChangeValue("Textbox_SettingsVoteTotal", Vote.Total);

        // Appearance
        ChangeValue("Combobox_SettingsAppearanceAnimSpd", System.Appearance.Anim.Spd);
        ChangeAnimSpd(System.Appearance.Anim.Spd);
    
    // Save Configuration
    // ???
}

// Load
    // Refresh
    window.onload = Refresh();

    // Load Configuration
    // ???

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
    function SetAppearanceAnimSpd() {
        System.Appearance.Anim.Spd = ReadValue("Combobox_SettingsAppearanceAnimSpd");
        Refresh();
    }

// Automations
    // Nothing here.
