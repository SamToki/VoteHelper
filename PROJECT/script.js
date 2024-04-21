// For SamToki.github.io/VoteHelper
// Released under GNU GPL v3 open source license.
// (C) 2023 SAM TOKI STUDIO

// Initialization
	// Declare Variables
	"use strict";
		// Unsaved
		const CurrentVersion = 3.00;
		var Vote0 = {
			Stats: {
				ElapsedSum: 0
			}
		};

		// Saved
		var Vote = {
			Options: {
				CandidateQuantity: 6,
				TotalVotes: 50
			},
			Stats: {
				Elapsed: [0, 0, 0, 0, 0, 0, 0]
			},
			Text: {
				Title: "",
				Candidate: [0, "", "", "", "", "", ""],
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
					"Error",
					"<span lang=\"en-US\">Sorry, this page currently does not support English (US).</span>",
					"", "", "<span lang=\"en-US\">OK</span>");
				break;
			case "ja-JP":
				ShowDialog("System_LanguageUnsupported",
					"Error",
					"<span lang=\"ja-JP\">すみません。このページは日本語にまだサポートしていません。</span>",
					"", "", "<span lang=\"ja-JP\">OK</span>");
				break;
			case "zh-CN":
				/* ChangeCursorOverall("wait");
				window.location.replace("index.html"); */
				break;
			case "zh-TW":
				ShowDialog("System_LanguageUnsupported",
					"Error",
					"<span lang=\"zh-TW\">抱歉，本頁面暫不支援繁體中文。</span>",
					"", "", "<span lang=\"zh-TW\">確定</span>");
				break;
			default:
				AlertSystemError("The value of System.I18n.Language \"" + System.I18n.Language + "\" in function Load is out of expectation.");
				break;
		}
		if(typeof(System.Version.VoteHelper) != "undefined") {
			if(Math.floor(CurrentVersion) - Math.floor(System.Version.VoteHelper) >= 1) {
				ShowDialog("System_MajorUpdateDetected",
					"Info",
					"检测到大版本更新。若您继续使用旧版本的用户数据，则有可能发生兼容性问题。敬请留意。",
					"", "", "确定");
				System.Version.VoteHelper = CurrentVersion;
			}
		} else {
			System.Version.VoteHelper = CurrentVersion;
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
					ChangeLink("ThemeVariant_Common", "../common-Dark.css");
					ChangeMediaCondition("ThemeVariant_Common", "(prefers-color-scheme: dark)");
					ChangeLink("ThemeVariant_Style", "style-Dark.css");
					ChangeMediaCondition("ThemeVariant_Style", "(prefers-color-scheme: dark)");
					break;
				case "Default":
					ChangeLink("ThemeVariant_Common", "");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "Dark":
					ChangeLink("ThemeVariant_Common", "../common-Dark.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "style-Dark.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "Genshin":
					ChangeLink("ThemeVariant_Common", "../common-Genshin.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "style-Genshin.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "HighContrast":
					ChangeLink("ThemeVariant_Common", "../common-HighContrast.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "style-HighContrast.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				default:
					AlertSystemError("The value of System.Display.Theme \"" + System.Display.Theme + "\" in function RefreshSystem is out of expectation.");
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
					AlertSystemError("The value of System.Display.Cursor \"" + System.Display.Cursor + "\" in function RefreshSystem is out of expectation.");
					break;
			}
			ChangeChecked("Checkbox_SettingsBlurBgImage", System.Display.BlurBgImage);
			if(System.Display.BlurBgImage == true) {
				ChangeFilter("Ctnr_BgImage", "blur(20px)");
			} else {
				ChangeFilter("Ctnr_BgImage", "");
			}
			ChangeChecked("Checkbox_SettingsShowTopbar", System.Display.ShowTopbar);
			if(System.Display.ShowTopbar == true && IsFullscreen() == false) {
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
					AlertSystemError("The value of System.Display.HotkeyIndicators \"" + System.Display.HotkeyIndicators + "\" in function RefreshSystem is out of expectation.");
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
		for(let Looper = 1; Looper <= Vote.Options.CandidateQuantity; Looper++) {
			Show("CtrlGroup_VoteCandidate" + Looper);
			ChangeHeight("CtrlGroup_VoteCandidate" + Looper, "calc((100% - " + 10 * Vote.Options.CandidateQuantity + "px) / " + Vote.Options.CandidateQuantity + ")");
			ChangeDisabled("Cmdbtn_VoteCandidate" + Looper, false);
			Show("Dropctrl_VoteUndo" + Looper);
			if(Vote.Stats.Elapsed[Looper] > 0) {
				ChangeDisabled("Dropbtn_VoteUndo" + Looper, false);
			} else {
				ChangeDisabled("Dropbtn_VoteUndo" + Looper, true);
			}
		}
		for(let Looper = 6; Looper > Vote.Options.CandidateQuantity; Looper--) {
			Vote.Stats.Elapsed[Looper] = 0;
			Hide("CtrlGroup_VoteCandidate" + Looper);
			Hide("Dropctrl_VoteUndo" + Looper);
		}
		Vote0.Stats.ElapsedSum = 0;
		for(let Looper = 1; Looper <= 6; Looper++) {
			Vote0.Stats.ElapsedSum += Vote.Stats.Elapsed[Looper];
		}
		let Percentage = 0, Percentage2 = 0;
		for(let Looper = 1; Looper <= 6; Looper++) {
			if(Vote0.Stats.ElapsedSum == 0) {
				Percentage = 0;
				Percentage2 = 0;
			} else {
				Percentage = Vote.Stats.Elapsed[Looper] / Vote0.Stats.ElapsedSum * 100;
				Percentage2 = Vote.Stats.Elapsed[Looper] / Math.max(...Vote.Stats.Elapsed) * 100;
			}
			ChangeProgbar("ProgbarFg_VoteCandidate" + Looper, "Horizontal", 20, Percentage2);
			ChangeText("ProgbarText1_VoteCandidate" + Looper, Vote.Stats.Elapsed[Looper]);
			ChangeText("ProgbarText2_VoteCandidate" + Looper, Percentage.toFixed(2) + "%");
		}
		if(Vote0.Stats.ElapsedSum == 0) {
			Percentage = 0;
		} else {
			Percentage = Vote0.Stats.ElapsedSum / Vote.Options.TotalVotes * 100;
		}
		ChangeProgring("ProgringFg_Vote", 289.03, Percentage);
		ChangeText("ProgringText_Vote", Percentage.toFixed(0) + "%");
		ChangeText("Label_VoteElapsed", Vote0.Stats.ElapsedSum);
		ChangeText("Label_VoteTotal", "/" + Vote.Options.TotalVotes);
		ChangeHeight("DropctrlGroup_VoteUndo", 40 * Vote.Options.CandidateQuantity + "px");

		// Finish Voting
		if(Vote0.Stats.ElapsedSum >= Vote.Options.TotalVotes) {
			Vote0.Stats.ElapsedSum = Vote.Options.TotalVotes;
			for(let Looper = 1; Looper <= Vote.Options.CandidateQuantity; Looper++) {
				ChangeDisabled("Cmdbtn_VoteCandidate" + Looper, true);
			}
			ChangeText("ProgringText_Vote", "完成");
			ShowToast("投票完成");
		}

		// Text
		ChangeValue("Textbox_VoteTitle", Vote.Text.Title);
		for(let Looper = 1; Looper <= 6; Looper++) {
			ChangeValue("Textbox_VoteCandidate" + Looper, Vote.Text.Candidate[Looper]);
		}
		ChangeValue("Textbox_VoteNote", Vote.Text.Note);

		// Settings
			// Vote
			ChangeValue("Textbox_SettingsCandidateQuantity", Vote.Options.CandidateQuantity);
			ChangeValue("Textbox_SettingsTotalVotes", Vote.Options.TotalVotes);
		
		// Save User Data
		localStorage.setItem("VoteHelper_Vote", JSON.stringify(Vote));
	}

// Cmds
	// Vote
	function CountVote(Selector) {
		if(Vote.Options.CandidateQuantity >= Selector && Vote0.Stats.ElapsedSum < Vote.Options.TotalVotes) {
			Vote.Stats.Elapsed[Selector]++;
		}
		RefreshVote();
	}
	function UndoVote(Selector) {
		if(Vote.Options.CandidateQuantity >= Selector && Vote.Stats.Elapsed[Selector] >= 1) {
			Vote.Stats.Elapsed[Selector]--;
		}
		RefreshVote();
	}
	function ResetVote() {
		Vote.Stats.Elapsed = [0, 0, 0, 0, 0, 0, 0];
		RefreshVote();
	}
	function SaveVoteText() {
		Vote.Text.Title = ReadValue("Textbox_VoteTitle");
		for(let Looper = 1; Looper <= 6; Looper++) {
			Vote.Text.Candidate[Looper] = ReadValue("Textbox_VoteCandidate" + Looper);
		}
		Vote.Text.Note = ReadValue("Textbox_VoteNote");
		RefreshVote();
	}

	// Settings
		// Vote
		function SetCandidateQuantity() {
			Vote.Options.CandidateQuantity = parseInt(Number(ReadValue("Textbox_SettingsCandidateQuantity"))); // Use parseInt(Number()) to force convert value to integer.
			if(Vote.Options.CandidateQuantity < 1) {
				Vote.Options.CandidateQuantity = 1;
			}
			if(Vote.Options.CandidateQuantity > 6) {
				Vote.Options.CandidateQuantity = 6;
			}
			RefreshVote();
		}
		function SetTotalVotes() {
			Vote.Options.TotalVotes = parseInt(Number(ReadValue("Textbox_SettingsTotalVotes")));
			if(Vote.Options.TotalVotes < 5) {
				Vote.Options.TotalVotes = 5;
			}
			if(Vote.Options.TotalVotes > 9999) {
				Vote.Options.TotalVotes = 9999;
			}
			if(Vote.Options.TotalVotes < Vote0.Stats.ElapsedSum) {
				Vote.Options.TotalVotes = Vote0.Stats.ElapsedSum;
			}
			RefreshVote();
		}

		// User Data
		function ImportUserData() {
			if(ReadValue("Textbox_SettingsUserDataImport") != "") {
				if(ReadValue("Textbox_SettingsUserDataImport").startsWith("{\"System\":{\"Display\":{\"Theme\":") == true) {
					let Objects = JSON.parse(ReadValue("Textbox_SettingsUserDataImport"));
					Object.keys(Objects).forEach(function(ObjectName) {
						localStorage.setItem(ObjectName, JSON.stringify(Objects[ObjectName]));
					});
					ChangeCursorOverall("wait");
					window.location.reload();
				} else {
					ShowDialog("System_JSONStringFormatMismatch",
						"Error",
						"JSON 字符串格式不匹配。请检查您粘贴的文本。",
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
				"Info",
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
			case "System_MajorUpdateDetected":
			case "System_JSONStringFormatMismatch":
			case "System_UserDataExported":
				switch(Selector) {
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is out of expectation.");
						break;
				}
				break;
			case "System_ConfirmClearUserData":
				switch(Selector) {
					case 2:
						localStorage.clear();
						ChangeCursorOverall("wait");
						window.location.reload();
						break;
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is out of expectation.");
						break;
				}
				break;
			case "System_Error":
				switch(Selector) {
					case 2:
						window.location.replace("#Item_SettingsUserData");
						break;
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is out of expectation.");
						break;
				}
				break;
			default:
				AlertSystemError("The value of Interaction.DialogEvent \"" + Interaction.DialogEvent + "\" in function AnswerDialog is out of expectation.");
				break;
		}
		HideDialog();
	}

// Listeners
	// On Keyboard
	document.addEventListener("keydown", function(Hotkey) {
		if(document.activeElement.tagName.toLowerCase() != "input" && document.activeElement.tagName.toLowerCase() != "textarea") { // Prevent hotkey activation when inputing text etc.
			switch(Hotkey.key.toUpperCase()) {
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
					if(Hotkey.key <= Vote.Options.CandidateQuantity) {
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
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || (System.Display.HotkeyIndicators == "ShowOnWrongKeyPress" && Hotkey.key != "Escape" && Hotkey.key != "Tab" && Hotkey.key != "Enter" && Hotkey.key != " ")) {
						ShowHotkeyIndicators();
					}
					break;
			}
		}
	});

// Error Handling
function AlertSystemError(Message) {
	console.error("● 系统错误\n" +
		Message);
	ShowDialog("System_Error",
		"Error",
		"抱歉，发生了系统错误。您可在浏览器控制台查看错误信息，或尝试清空用户数据以解决问题。是否前往用户数据？",
		"", "前往", "取消");
}
