// For SamToki.github.io/VoteHelper
// Released under GNU GPL v3 open source license.
// (C) 2015-2023 SAM TOKI STUDIO

// Initialization
	// Declare Variables
	"use strict";
		// Unsaved
		var Vote0 = {
			ElapsedSum: 0,
			Percentage: 0, Percentage2: 0
		};

		// Saved
		var Vote = {
			CandidateQuantity: 6,
			Total: 50,
			Elapsed: [0, 0, 0, 0, 0, 0, 0],
			Text: {
				Title: "",
				Candidate1: "", Candidate2: "", Candidate3: "", Candidate4: "", Candidate5: "", Candidate6: "",
				Note: ""
			}
		};

	// Load User Data
	window.onload = Load();
	function Load() {
		if(typeof(localStorage.System) != "undefined") {
			System = JSON.parse(localStorage.getItem("System"));
		} else {
			System.I18n.Language = "zh-CN";
		}
		switch(System.I18n.Language) {
			case "en-US":
				ShowDialog("System_LanguageUnsupported",
					"Termination",
					"<span lang='en-US'>Sorry, this page currently does not support English (US).</span>",
					"", "", "<span lang='en-US'>OK</span>");
				break;
			case "ja-JP":
				ShowDialog("System_LanguageUnsupported",
					"Termination",
					"<span lang='ja-JP'>すみません。このページは日本語にまだサポートしていません。</span>",
					"", "", "<span lang='ja-JP'>OK</span>");
				break;
			case "zh-CN":
				/* ChangeCursorOverall("wait");
				window.location.replace("index.html"); */
				break;
			case "zh-TW":
				ShowDialog("System_LanguageUnsupported",
					"Termination",
					"<span lang='zh-TW'>抱歉，本頁面暫不支援繁體中文。</span>",
					"", "", "<span lang='zh-TW'>確定</span>");
				break;
			default:
				alert("Error: The value of System.I18n.Language in function Load is out of expectation.");
				break;
		}
		RefreshSystem();
		if(typeof(localStorage.VoteHelper_Vote) != "undefined") {
			Vote = JSON.parse(localStorage.getItem("VoteHelper_Vote"));
		}
		RefreshVote();
		setTimeout(HideToast, 0);
	}

// Refresh
	// System
	function RefreshSystem() {
		// Settings
			// Display
			ChangeValue("Combobox_SettingsTheme", System.Display.Theme);
			switch(System.Display.Theme) {
				case "Auto":
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
				default:
					alert("Error: The value of System.Display.Theme in function RefreshSystem is out of expectation.");
					break;
			}
			ChangeValue("Combobox_SettingsCursor", System.Display.Cursor);
			switch(System.Display.Cursor) {
				case "Default":
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
				default:
					alert("Error: The value of System.Display.Cursor in function RefreshSystem is out of expectation.");
					break;
			}
			ChangeChecked("Checkbox_SettingsShowTopbar", System.Display.ShowTopbar);
			if(System.Display.ShowTopbar == true) {
				Show("Topbar");
			} else {
				Hide("Topbar");
			}
			ChangeValue("Combobox_SettingsHotkeyIndicators", System.Display.HotkeyIndicators);
			switch(System.Display.HotkeyIndicators) {
				case "Disabled":
					FadeHotkeyIndicators();
					break;
				case "ShowOnWrongKeyPress":
				case "ShowOnAnyKeyPress":
					break;
				case "AlwaysShow":
					ShowHotkeyIndicators();
					break;
				default:
					alert("Error: The value of System.Display.HotkeyIndicators in function RefreshSystem is out of expectation.");
					break;
			}
			ChangeValue("Combobox_SettingsAnim", System.Display.Anim);
			ChangeAnimOverall(System.Display.Anim);

			// Dev
			ChangeChecked("Checkbox_SettingsShowDebugOutlines", System.Dev.ShowDebugOutlines);
			ChangeShowDebugOutlines(System.Dev.ShowDebugOutlines);
			ChangeChecked("Checkbox_SettingsUseOldTypeface", System.Dev.UseOldTypeface);
			if(System.Dev.UseOldTypeface == true) {
				ChangeLanguage("Html", "ja-JP");
			} else {
				ChangeLanguage("Html", "zh-CN");
			}
			ChangeValue("Textbox_SettingsFont", System.Dev.Font);
			ChangeFont("Html", System.Dev.Font);

			// User Data
			ChangeValue("Textbox_SettingsUserDataImport", "");

		// Save User Data
		localStorage.setItem("System", JSON.stringify(System));
	}

	// Vote
	function RefreshVote() {
		// Main
		for(Looper = 1; Looper <= Vote.CandidateQuantity; Looper++) {
			Show("CtrlGroup_VoteCandidate" + Looper);
			ChangeHeight("CtrlGroup_VoteCandidate" + Looper, "calc((100% - " + 10 * Vote.CandidateQuantity + "px) / " + Vote.CandidateQuantity + ")");
			ChangeDisabled("Cmdbtn_VoteCandidate" + Looper, false);
			Show("Dropctrl_VoteUndo" + Looper);
			if(Vote.Elapsed[Looper] > 0) {
				ChangeDisabled("Dropbtn_VoteUndo" + Looper, false);
			} else {
				ChangeDisabled("Dropbtn_VoteUndo" + Looper, true);
			}
		}
		for(Looper = 6; Looper > Vote.CandidateQuantity; Looper--) {
			Vote.Elapsed[Looper] = 0;
			Hide("CtrlGroup_VoteCandidate" + Looper);
			Hide("Dropctrl_VoteUndo" + Looper);
		}
		Vote0.ElapsedSum = 0;
		for(Looper = 1; Looper <= 6; Looper++) {
			Vote0.ElapsedSum = Vote0.ElapsedSum + Vote.Elapsed[Looper];
		}
		for(Looper = 1; Looper <= 6; Looper++) {
			if(Vote0.ElapsedSum == 0) {
				Vote0.Percentage = 0;
				Vote0.Percentage2 = 0;
			} else {
				Vote0.Percentage = Vote.Elapsed[Looper] / Vote0.ElapsedSum * 100;
				Vote0.Percentage2 = Vote.Elapsed[Looper] / Math.max(...Vote.Elapsed) * 100;
			}
			ChangeWidth("ProgbarFg_VoteCandidate" + Looper, "calc(20px + (100% - 20px) * " + (Vote0.Percentage2 / 100) + ")");
			ChangeText("ProgbarText1_VoteCandidate" + Looper, Vote.Elapsed[Looper]);
			ChangeText("ProgbarText2_VoteCandidate" + Looper, Vote0.Percentage.toFixed(2) + "%");
		}
		if(Vote0.ElapsedSum == 0) {
			Vote0.Percentage = 0;
		} else {
			Vote0.Percentage = Vote0.ElapsedSum / Vote.Total * 100;
		}
		ChangeProgring("ProgringFg_Vote", 289.03 * (1 - Vote0.Percentage / 100));
		ChangeText("ProgringText_Vote", Vote0.Percentage.toFixed(0) + "%");
		ChangeText("Label_VoteElapsed", Vote0.ElapsedSum);
		ChangeText("Label_VoteTotal", "/" + Vote.Total);
		ChangeHeight("DropctrlGroup_VoteUndo", 40 * Vote.CandidateQuantity + "px");

		// Finish Voting
		if(Vote0.ElapsedSum >= Vote.Total) {
			Vote0.ElapsedSum = Vote.Total;
			for(Looper = 1; Looper <= Vote.CandidateQuantity; Looper++) {
				ChangeDisabled("Cmdbtn_VoteCandidate" + Looper, true);
			}
			ChangeText("ProgringText_Vote", "完成");
			ShowToast("投票完成");
		}

		// Text
		ChangeValue("Textbox_VoteTitle", Vote.Text.Title);
		ChangeValue("Textbox_VoteCandidate1", Vote.Text.Candidate1);
		ChangeValue("Textbox_VoteCandidate2", Vote.Text.Candidate2);
		ChangeValue("Textbox_VoteCandidate3", Vote.Text.Candidate3);
		ChangeValue("Textbox_VoteCandidate4", Vote.Text.Candidate4);
		ChangeValue("Textbox_VoteCandidate5", Vote.Text.Candidate5);
		ChangeValue("Textbox_VoteCandidate6", Vote.Text.Candidate6);
		ChangeValue("Textbox_VoteNote", Vote.Text.Note);

		// Settings
			// Vote
			ChangeValue("Textbox_SettingsCandidateQuantity", Vote.CandidateQuantity);
			ChangeValue("Textbox_SettingsTotalVotes", Vote.Total);
		
		// Save User Data
		localStorage.setItem("VoteHelper_Vote", JSON.stringify(Vote));
	}

// Cmds
	// Vote
	function CountVote(Selector) {
		if(Vote.CandidateQuantity >= Selector && Vote0.ElapsedSum < Vote.Total) {
			Vote.Elapsed[Selector]++;
		}
		RefreshVote();
	}
	function UndoVote(Selector) {
		if(Vote.CandidateQuantity >= Selector && Vote.Elapsed[Selector] >= 1) {
			Vote.Elapsed[Selector]--;
		}
		RefreshVote();
	}
	function ResetVote() {
		Vote.Elapsed = [0, 0, 0, 0, 0, 0, 0];
		RefreshVote();
	}
	function SaveVoteText() {
		Vote.Text.Title = ReadValue("Textbox_VoteTitle");
		Vote.Text.Candidate1 = ReadValue("Textbox_VoteCandidate1");
		Vote.Text.Candidate2 = ReadValue("Textbox_VoteCandidate2");
		Vote.Text.Candidate3 = ReadValue("Textbox_VoteCandidate3");
		Vote.Text.Candidate4 = ReadValue("Textbox_VoteCandidate4");
		Vote.Text.Candidate5 = ReadValue("Textbox_VoteCandidate5");
		Vote.Text.Candidate6 = ReadValue("Textbox_VoteCandidate6");
		Vote.Text.Note = ReadValue("Textbox_VoteNote");
		RefreshVote();
	}

	// Settings
		// Vote
		function SetCandidateQuantity() {
			Vote.CandidateQuantity = parseInt(Number(ReadValue("Textbox_SettingsCandidateQuantity"))); // Use parseInt(Number()) to force convert value to integer.
			if(Vote.CandidateQuantity < 1) {
				Vote.CandidateQuantity = 1;
			}
			if(Vote.CandidateQuantity > 6) {
				Vote.CandidateQuantity = 6;
			}
			RefreshVote();
		}
		function SetTotalVotes() {
			Vote.Total = parseInt(Number(ReadValue("Textbox_SettingsTotalVotes")));
			if(Vote.Total < 5) {
				Vote.Total = 5;
			}
			if(Vote.Total > 9999) {
				Vote.Total = 9999;
			}
			if(Vote0.ElapsedSum > Vote.Total) {
				Vote.Total = Vote0.ElapsedSum;
			}
			RefreshVote();
		}

		// User Data
		function ImportUserData() {
			if(ReadValue("Textbox_SettingsUserDataImport") != null) {
				if(ReadValue("Textbox_SettingsUserDataImport").startsWith("{\"System\"") == true) {
					ChangeCursorOverall("wait");
					Elements = JSON.parse(ReadValue("Textbox_SettingsUserDataImport"));
					Object.keys(Elements).forEach(function(Looper) {
						localStorage.setItem(Looper, JSON.stringify(Elements[Looper]));
					});
					window.location.reload();
				} else {
					ShowDialog("System_JSONStringFormatMismatch",
						"Termination",
						"JSON 字符串格式不匹配。请检查您粘贴的文本的来源。",
						"", "", "确定");
					RefreshSystem();
				}
			}
		}
		function ExportUserData() {
			navigator.clipboard.writeText("{" +
				"\"System\":" + JSON.stringify(System) + "," +
				"\"VoteHelper_Vote\":" + JSON.stringify(Vote) +
				"}");
			ShowDialog("System_UserDataExported",
				"Completion",
				"已将用户数据导出至剪贴板。若要分享，请注意其中是否包含个人信息。",
				"", "", "确定");
		}
		function ConfirmClearUserData() {
			ShowDialog("System_ConfirmClearUserData",
				"Caution",
				"您确认要清空用户数据？",
				"", "清空", "取消");
		}
	
	// Dialog
	function AnswerDialog(Selector) {
		switch(Interaction.DialogEvent) {
			case "System_LanguageUnsupported":
			case "System_JSONStringFormatMismatch":
			case "System_UserDataExported":
				switch(Selector) {
					case 3:
						break;
					default:
						alert("Error: The value of Selector in function AnswerDialog is out of expectation.");
						break;
				}
				break;
			case "System_ConfirmClearUserData":
				switch(Selector) {
					case 2:
						ChangeCursorOverall("wait");
						localStorage.clear();
						window.location.reload();
						break;
					case 3:
						break;
					default:
						alert("Error: The value of Selector in function AnswerDialog is out of expectation.");
						break;
				}
				break;
			default:
				alert("Error: The value of Interaction.DialogEvent in function AnswerDialog is out of expectation.");
				break;
		}
		HideDialog();
	}

// Listeners
	// On Keyboard
	document.addEventListener("keydown", function(Hotkey) {
		if(document.activeElement.tagName.toLowerCase() != "input") { // Prevent hotkey activation when inputing text etc.
			switch(Hotkey.key.toUpperCase()) {
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
					if(Hotkey.key <= Vote.CandidateQuantity) {
						Click("Cmdbtn_VoteCandidate" + Hotkey.key);
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress") {
						ShowHotkeyIndicators();
					}
					break;
				case "R":
					Click("Cmdbtn_VoteReset");
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress") {
						ShowHotkeyIndicators();
					}
					break;
				default:
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "ShowOnWrongKeyPress") {
						ShowHotkeyIndicators();
					}
					break;
			}
		}
	});
