// For SamToki.github.io/VoteHelper

// Initialization
	// Declare Variables
	"use strict";
		// Unsaved
		var Looper = 0, Percentage = 0, Percentage2 = 0;
		
		// Saved
		var Vote = {
			CandidateQuantity: 6,
			Total: 50,
			Elapsed: [0, 0, 0, 0, 0, 0, 0], ElapsedSum: 0,
			Text: {
				Title: "",
				Candidate1Name: "", Candidate2Name: "", Candidate3Name: "", Candidate4Name: "", Candidate5Name: "", Candidate6Name: "",
				Note: ""
			}
		};

	// Load User Data
	window.onload = function() {
		if(localStorage.System) {
			System = JSON.parse(localStorage.getItem("System"));
		} else {
			System.I18n.Language = "zh-CN";
		}
		switch(System.I18n.Language) {
			case "zh-CN":
				// window.location.replace("index.html");
				break;
			case "en-US":
				PopupDialogAppear("System_LanguageUnsupported",
					"Termination",
					"<span lang='en-US'>Sorry, this page currently does not support English (US).</span>",
					"<span lang='en-US'>OK</span>", "", "");
				break;
			case "ja-JP":
				PopupDialogAppear("System_LanguageUnsupported",
					"Termination",
					"<span lang='ja-JP'>すみません。このページは日本語にまだサポートしていません。</span>",
					"<span lang='ja-JP'>OK</span>", "", "");
				break;
			case "zh-TW":
				PopupDialogAppear("System_LanguageUnsupported",
					"Termination",
					"<span lang='zh-TW'>抱歉，本頁面暫不支援繁體中文。</span>",
					"<span lang='zh-TW'>確定</span>", "", "");
				break;
			default:
				alert("Error: The value of System.I18n.Language in function window.onload is out of expectation.");
				break;
		}
		RefreshSystem();
		if(localStorage.VoteHelper_Vote) {
			Vote = JSON.parse(localStorage.getItem("VoteHelper_Vote"));
		}
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
				ChangeShow("Topbar");
				ChangeShow("SectionTitleBelowTopbar");
				ChangeHeight("ViewportBelowTopbar", "");
			} else {
				ChangeHide("Topbar");
				ChangeHide("SectionTitleBelowTopbar");
				ChangeHeight("ViewportBelowTopbar", "100%");
			}
			ChangeValue("Combobox_SettingsDisplayAnimSpeed", System.Display.Anim.Speed);
			ChangeAnimSpeedOverall(System.Display.Anim.Speed);

			// Sound
			ChangeChecked("Checkbox_SettingsSoundPlaySound", System.Sound.PlaySound);
			
			// I18n
			ChangeValue("Combobox_SettingsI18nLanguage", System.I18n.Language);

			// Dev
			ChangeChecked("Checkbox_SettingsDevShowAllBorders", System.Dev.ShowAllBorders);
			Elements = document.getElementsByTagName("*");
			if(System.Dev.ShowAllBorders == true) {
				for(Looper = 0; Looper < Elements.length; Looper++) {
					Elements[Looper].style.border = "1px solid #FF0000";
				}
			} else {
				for(Looper = 0; Looper < Elements.length; Looper++) {
					Elements[Looper].style.border = "";
				}
			}
			ChangeChecked("Checkbox_SettingsDevUseOldTypeface", System.Dev.UseOldTypeface);
			Elements = document.getElementsByTagName("html");
			if(System.Dev.UseOldTypeface == true) {
				Elements[0].lang = "ja-JP";
			} else {
				Elements[0].lang = "zh-CN";
			}
			ChangeValue("Textbox_SettingsDevFont", System.Dev.Font);
			Elements = document.getElementsByTagName("html");
			Elements[0].style.fontFamily = System.Dev.Font;

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
			ChangeShow("CtrlGroup_VoteCandidate" + Looper);
			ChangeHeight("CtrlGroup_VoteCandidate" + Looper, "calc(100% / " + Vote.CandidateQuantity + ")");
			ChangeDisabled("Dropbtn_VoteUndo" + Looper, false);
			ChangeShow("Dropctrl_VoteUndo" + Looper);
		}
		for(Looper = 6; Looper > Vote.CandidateQuantity; Looper--) {
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

		// Finish Voting
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
			ChangeValue("Textbox_SettingsVoteCandidateQuantity", Vote.CandidateQuantity);
			ChangeValue("Textbox_SettingsVoteTotal", Vote.Total);
		
		// Save User Data
		localStorage.setItem("VoteHelper_Vote", JSON.stringify(Vote));
	}

// Cmds
	// Vote
	function VoteCount(Selector) {
		if(Vote.CandidateQuantity >= Selector && Vote.ElapsedSum < Vote.Total) {
			Vote.Elapsed[Selector]++;
		}
		RefreshVote();
	}
	function VoteUndo(Selector) {
		if(Vote.CandidateQuantity >= Selector && Vote.Elapsed[Selector] >= 1) {
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
			if(Vote.ElapsedSum > Vote.Total) {
				Vote.Total = Vote.ElapsedSum;
			}
			RefreshVote();
		}

		// I18n
		function SetI18nLanguage() {
			System.I18n.Language = ReadValue("Combobox_SettingsI18nLanguage");
			switch(System.I18n.Language) {
				case "zh-CN":
					// window.location.replace("index.html");
					break;
				case "en-US":
					PopupDialogAppear("System_LanguageUnsupported",
						"Termination",
						"<span lang='en-US'>Sorry, this page currently does not support English (US).</span>",
						"<span lang='en-US'>OK</span>", "", "");
					break;
				case "ja-JP":
					PopupDialogAppear("System_LanguageUnsupported",
						"Termination",
						"<span lang='ja-JP'>すみません。このページは日本語にまだサポートしていません。</span>",
						"<span lang='ja-JP'>OK</span>", "", "");
					break;
				case "zh-TW":
					PopupDialogAppear("System_LanguageUnsupported",
						"Termination",
						"<span lang='zh-TW'>抱歉，本頁面暫不支援繁體中文。</span>",
						"<span lang='zh-TW'>確定</span>", "", "");
					break;
				default:
					alert("Error: The value of System.I18n.Language in function SetI18nLanguage is out of expectation.");
					break;
			}
			RefreshSystem();
		}

		// User Data
		function SetUserDataImport() {
			if(ReadValue("Textbox_SettingsUserDataImport") != null) {
				if(ReadValue("Textbox_SettingsUserDataImport").startsWith("{\"System\"") == true) {
					Elements = JSON.parse(ReadValue("Textbox_SettingsUserDataImport"));
					Object.keys(Elements).forEach(function(Looper) {
						localStorage.setItem(Looper, JSON.stringify(Elements[Looper]));
					});
					window.location.reload();
				} else {
					PopupDialogAppear("System_JSONStringFormatMismatch",
						"Termination",
						"JSON 字符串格式不匹配。请检查您粘贴的文本的来源。",
						"确定", "", "");
					ChangeValue("Textbox_SettingsUserDataImport", "");
				}
			}
		}
		function SetUserDataExport() {
			navigator.clipboard.writeText("{" +
				"\"System\":" + JSON.stringify(System) + "," +
				"\"VoteHelper_Vote\":" + JSON.stringify(Vote) +
				"}");
			PopupDialogAppear("System_UserDataExported",
				"Completion",
				"已将用户数据以 JSON 字符串的形式导出至剪贴板。若要分享，请注意其中是否包含个人信息。",
				"确定", "", "");
		}
		function SetUserDataClear() {
			PopupDialogAppear("System_ConfirmClearUserData",
				"Caution",
				"您确认要清空用户数据？",
				"清空", "取消", "");
		}
	
	// Popup Dialog Answer
	function PopupDialogAnswer(Selector) {
		switch(Interaction.PopupDialogEvent) {
			case "System_LanguageUnsupported":
			case "System_JSONStringFormatMismatch":
			case "System_UserDataExported":
				switch(Selector) {
					case 1:
						break;
					default:
						alert("Error: The value of Selector in function PopupDialogAnswer is out of expectation.");
						break;
				}
				break;
			case "System_ConfirmClearUserData":
				switch(Selector) {
					case 1:
						localStorage.clear();
						window.location.reload();
						break;
					case 2:
						break;
					default:
						alert("Error: The value of Selector in function PopupDialogAnswer is out of expectation.");
						break;
				}
				break;
			default:
				alert("Error: The value of Interaction.PopupDialogEvent in function PopupDialogAnswer is out of expectation.");
				break;
		}
		PopupDialogDisappear();
	}

// Automations
	// Nothing here.
