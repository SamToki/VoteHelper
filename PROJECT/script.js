// For SamToki.github.io/VoteHelper

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
				Candidate1Name: "", Candidate2Name: "", Candidate3Name: "", Candidate4Name: "", Candidate5Name: "", Candidate6Name: "",
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
			case "zh-CN":
				/* ChangeCursorOverall("wait");
				window.location.replace("index.html"); */
				break;
			case "en-US":
				ShowPopupDialog("System_LanguageUnsupported",
					"Termination",
					"<span lang='en-US'>Sorry, this page currently does not support English (US).</span>",
					"", "", "<span lang='en-US'>OK</span>");
				break;
			case "ja-JP":
				ShowPopupDialog("System_LanguageUnsupported",
					"Termination",
					"<span lang='ja-JP'>すみません。このページは日本語にまだサポートしていません。</span>",
					"", "", "<span lang='ja-JP'>OK</span>");
				break;
			case "zh-TW":
				ShowPopupDialog("System_LanguageUnsupported",
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
	}

// Refresh
	// System
	function RefreshSystem() {
		// Settings
			// Display
			ChangeValue("Combobox_SettingsDisplayTheme", System.Display.Theme);
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
			ChangeValue("Combobox_SettingsDisplayCursor", System.Display.Cursor);
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
			ChangeChecked("Checkbox_SettingsDisplayShowTopbar", System.Display.ShowTopbar);
			if(System.Display.ShowTopbar == true) {
				Show("Topbar");
				Show("SectionTitleAboveViewport");
				ChangeHeightByClass("Viewport", "");
			} else {
				Hide("Topbar");
				Hide("SectionTitleAboveViewport");
				ChangeHeightByClass("Viewport", "calc(100% - 30px)");
			}
			ChangeValue("Combobox_SettingsDisplayAnimSpeed", System.Display.Anim.Speed);
			ChangeAnimSpeedOverall(System.Display.Anim.Speed);

			// Dev
			ChangeChecked("Checkbox_SettingsDevShowAllBorders", System.Dev.ShowAllBorders);
			ChangeShowAllBorders(System.Dev.ShowAllBorders);
			ChangeChecked("Checkbox_SettingsDevUseOldTypeface", System.Dev.UseOldTypeface);
			Elements = document.getElementsByTagName("html");
			if(System.Dev.UseOldTypeface == true) {
				Elements[0].lang = "ja-JP";
			} else {
				Elements[0].lang = "zh-CN";
			}
			ChangeValue("Textbox_SettingsDevFont", System.Dev.Font);
			ChangeFontOverall(System.Dev.Font);

			// User Data
			ChangeValue("Textbox_SettingsUserDataImport", "");

		// Save User Data
		localStorage.setItem("System", JSON.stringify(System));
	}

	// Vote
	function RefreshVote() {
		// Main
		for(Looper = 1; Looper <= Vote.CandidateQuantity; Looper++) {
			ChangeDisabled("Cmdbtn_VoteCandidate" + Looper, false);
			Show("CtrlGroup_VoteCandidate" + Looper);
			ChangeHeight("CtrlGroup_VoteCandidate" + Looper, "calc((100% - " + 10 * Vote.CandidateQuantity + "px) / " + Vote.CandidateQuantity + ")");
			if(Vote.Elapsed[Looper] > 0) {
				ChangeDisabled("Dropbtn_VoteUndo" + Looper, false);
			} else {
				ChangeDisabled("Dropbtn_VoteUndo" + Looper, true);
			}
			Show("Dropctrl_VoteUndo" + Looper);
		}
		for(Looper = 6; Looper > Vote.CandidateQuantity; Looper--) {
			Vote.Elapsed[Looper] = 0;
			ChangeDisabled("Cmdbtn_VoteCandidate" + Looper, true);
			Hide("CtrlGroup_VoteCandidate" + Looper);
			ChangeDisabled("Dropbtn_VoteUndo" + Looper, true);
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
			ChangeText("ProgbarText1_VoteCandidate" + Looper, Vote.Elapsed[Looper]);
			ChangeText("ProgbarText2_VoteCandidate" + Looper, Vote0.Percentage.toFixed(2) + "%");
			ChangeWidth("ProgbarFg_VoteCandidate" + Looper, "calc(20px + (100% - 20px) * " + (Vote0.Percentage2 / 100) + ")");
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
			ChangeValue("Textbox_SettingsVoteCandidateQuantity", Vote.CandidateQuantity);
			ChangeValue("Textbox_SettingsVoteTotal", Vote.Total);
		
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
		function SetVoteCandidateQuantity() {
			Vote.CandidateQuantity = parseInt(Number(ReadValue("Textbox_SettingsVoteCandidateQuantity"))); // Use parseInt(Number()) to force convert value to integer.
			if(Vote.CandidateQuantity < 1) {
				Vote.CandidateQuantity = 1;
			}
			if(Vote.CandidateQuantity > 6) {
				Vote.CandidateQuantity = 6;
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
					ShowPopupDialog("System_JSONStringFormatMismatch",
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
			ShowPopupDialog("System_UserDataExported",
				"Completion",
				"已将用户数据以 JSON 字符串的形式导出至剪贴板。若要分享，请注意其中是否包含个人信息。",
				"", "", "确定");
		}
		function ClearUserData() {
			ShowPopupDialog("System_ConfirmClearUserData",
				"Caution",
				"您确认要清空用户数据？",
				"", "清空", "取消");
		}
	
	// Popup Dialog
	function AnswerPopupDialog(Selector) {
		switch(Interaction.PopupDialogEvent) {
			case "System_LanguageUnsupported":
			case "System_JSONStringFormatMismatch":
			case "System_UserDataExported":
				switch(Selector) {
					case 3:
						break;
					default:
						alert("Error: The value of Selector in function AnswerPopupDialog is out of expectation.");
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
						alert("Error: The value of Selector in function AnswerPopupDialog is out of expectation.");
						break;
				}
				break;
			case "":
				break;
			default:
				alert("Error: The value of Interaction.PopupDialogEvent in function AnswerPopupDialog is out of expectation.");
				break;
		}
		HidePopupDialog();
	}
