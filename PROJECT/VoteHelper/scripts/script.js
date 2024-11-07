// For SamToki.github.io/VoteHelper
// Released under GNU GPL v3 open source license.
// (C) 2023 SAM TOKI STUDIO

// Initialization
	// Declare variables
	"use strict";
		// Unsaved
		const CurrentVersion = 3.03;
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

	// Load user data
	window.onload = Load();
	function Load() {
		if(localStorage.System != undefined) {
			System = JSON.parse(localStorage.getItem("System"));
		}
		switch(System.I18n.Language) {
			case "Auto":
				/* navigator.language ... */
				break;
			case "en-US":
				/* ChangeCursorOverall("wait");
				window.location.replace("index_" + System.I18n.Language + ".html"); */
				ShowDialog("System_LanguageUnsupported",
					"Error",
					"<span lang=\"en-US\">Sorry, this page currently does not support English (US).</span>",
					"", "", "", "<span lang=\"en-US\">OK</span>");
				break;
			case "ja-JP":
				ShowDialog("System_LanguageUnsupported",
					"Error",
					"<span lang=\"ja-JP\">すみません。このページは日本語にまだサポートしていません。</span>",
					"", "", "", "<span lang=\"ja-JP\">OK</span>");
				break;
			case "zh-CN":
				break;
			case "zh-TW":
				ShowDialog("System_LanguageUnsupported",
					"Error",
					"<span lang=\"zh-TW\">抱歉，本頁面暫不支援繁體中文。</span>",
					"", "", "", "<span lang=\"zh-TW\">確定</span>");
				break;
			default:
				AlertSystemError("The value of System.I18n.Language \"" + System.I18n.Language + "\" in function Load is invalid.");
				break;
		}
		if(System.Version.VoteHelper != undefined) {
			if(Math.floor(CurrentVersion) - Math.floor(System.Version.VoteHelper) >= 1) {
				ShowDialog("System_MajorUpdateDetected",
					"Info",
					"检测到大版本更新。若您继续使用旧版本的用户数据，则有可能发生兼容性问题。敬请留意。",
					"", "", "", "确定");
				System.Version.VoteHelper = CurrentVersion;
			}
		} else {
			System.Version.VoteHelper = CurrentVersion;
		}
		if(localStorage.VoteHelper_Vote != undefined) {
			Vote = JSON.parse(localStorage.getItem("VoteHelper_Vote"));
		}
		RefreshSystem();
		RefreshVote();
		setTimeout(HideToast, 0);
	}

// Refresh
	// System
	function RefreshSystem() {
		// Settings
			// Display
			if(window.matchMedia("(prefers-contrast: more)").matches == false) {
				ChangeDisabled("Combobox_SettingsTheme", false);
			} else {
				System.Display.Theme = "HighContrast";
				ChangeDisabled("Combobox_SettingsTheme", true);
			}
			ChangeValue("Combobox_SettingsTheme", System.Display.Theme);
			switch(System.Display.Theme) {
				case "Auto":
					ChangeLink("ThemeVariant_Common", "../styles/common_Dark.css");
					ChangeMediaCondition("ThemeVariant_Common", "(prefers-color-scheme: dark)");
					ChangeLink("ThemeVariant_Style", "styles/style_Dark.css");
					ChangeMediaCondition("ThemeVariant_Style", "(prefers-color-scheme: dark)");
					break;
				case "Light":
					ChangeLink("ThemeVariant_Common", "");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "Dark":
					ChangeLink("ThemeVariant_Common", "../styles/common_Dark.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "styles/style_Dark.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "Genshin":
					ChangeLink("ThemeVariant_Common", "../styles/common_Genshin.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "styles/style_Genshin.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "HighContrast":
					ChangeLink("ThemeVariant_Common", "../styles/common_HighContrast.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "styles/style_HighContrast.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				default:
					AlertSystemError("The value of System.Display.Theme \"" + System.Display.Theme + "\" in function RefreshSystem is invalid.");
					break;
			}
			ChangeValue("Combobox_SettingsCursor", System.Display.Cursor);
			switch(System.Display.Cursor) {
				case "Default":
					ChangeCursorOverall("");
					break;
				case "BTRAhoge":
				case "Genshin":
				case "GenshinFurina":
				case "GenshinNahida":
					ChangeCursorOverall("url(../cursors/" + System.Display.Cursor + ".cur), auto");
					break;
				default:
					AlertSystemError("The value of System.Display.Cursor \"" + System.Display.Cursor + "\" in function RefreshSystem is invalid.");
					break;
			}
			ChangeChecked("Checkbox_SettingsBlurBgImage", System.Display.BlurBgImage);
			if(System.Display.BlurBgImage == true) {
				ChangeFilter("Ctnr_BgImage", "blur(10px)");
			} else {
				ChangeFilter("Ctnr_BgImage", "");
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
					AlertSystemError("The value of System.Display.HotkeyIndicators \"" + System.Display.HotkeyIndicators + "\" in function RefreshSystem is invalid.");
					break;
			}
			if(window.matchMedia("(prefers-reduced-motion: reduce)").matches == false) {
				ChangeDisabled("Combobox_SettingsAnim", false);
			} else {
				System.Display.Anim = 0;
				ChangeDisabled("Combobox_SettingsAnim", true);
			}
			ChangeValue("Combobox_SettingsAnim", System.Display.Anim);
			ChangeAnimOverall(System.Display.Anim);

			// Dev
			ChangeChecked("Checkbox_SettingsTryToOptimizePerformance", System.Dev.TryToOptimizePerformance);
			if(System.Dev.TryToOptimizePerformance == true) {
				AddClass("Html", "PerformanceOptimization");
			} else {
				RemoveClass("Html", "PerformanceOptimization");
			}
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

			// User data
			ChangeValue("Textbox_SettingsUserDataImport", "");

		// Save user data
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
			if(Vote0.Stats.ElapsedSum > 0) {
				Percentage = Vote.Stats.Elapsed[Looper] / Vote0.Stats.ElapsedSum * 100;
				Percentage2 = Vote.Stats.Elapsed[Looper] / Math.max(...Vote.Stats.Elapsed) * 100;
			} else {
				Percentage = 0;
				Percentage2 = 0;
			}
			ChangeProgbar("ProgbarFg_VoteCandidate" + Looper, "Horizontal", Percentage2);
			ChangeText("ProgbarText1_VoteCandidate" + Looper, Vote.Stats.Elapsed[Looper]);
			ChangeText("ProgbarText2_VoteCandidate" + Looper, Percentage.toFixed(2) + "%");
		}
		if(Vote0.Stats.ElapsedSum > 0) {
			Percentage = Vote0.Stats.ElapsedSum / Vote.Options.TotalVotes * 100;
			ChangeDisabled("Cmdbtn_VoteUndo", false);
			ChangeDisabled("Cmdbtn_VoteReset", false);
		} else {
			Percentage = 0;
			ChangeDisabled("Cmdbtn_VoteUndo", true);
			ChangeDisabled("Cmdbtn_VoteReset", true);
		}
		ChangeText("Label_VoteElapsed", Vote0.Stats.ElapsedSum);
		ChangeText("Label_VoteTotal", "/" + Vote.Options.TotalVotes);
		ChangeProgring("ProgringFg_Vote", 289.03, Percentage);
		ChangeText("ProgringText_Vote", Percentage.toFixed(0) + "%");
		ChangeHeight("DropctrlGroup_VoteUndo", 40 * Vote.Options.CandidateQuantity + 2 + "px");

		// Finish voting
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

		// Save user data
		localStorage.setItem("VoteHelper_Vote", JSON.stringify(Vote));
	}

// Cmds
	// Vote
	function CountVote(Selector) {
		if(Selector <= Vote.Options.CandidateQuantity && Vote0.Stats.ElapsedSum < Vote.Options.TotalVotes) {
			Vote.Stats.Elapsed[Selector]++;
			RefreshVote();
		} else {
			AlertSystemError("Function CountVote was called under invalid condition.");
		}
	}
	function UndoVote(Selector) {
		if(Selector <= Vote.Options.CandidateQuantity && Vote.Stats.Elapsed[Selector] >= 1) {
			Vote.Stats.Elapsed[Selector]--;
			RefreshVote();
		} else {
			AlertSystemError("Function UndoVote was called under invalid condition.");
		}
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

		// User data
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
					ShowDialog("System_JSONStringInvalid",
						"Error",
						"您键入的 JSON 字符串不合法。",
						"", "", "", "确定");
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
				"已导出本页的用户数据至剪贴板。",
				"", "", "", "确定");
		}
		function ConfirmClearUserData() {
			ShowDialog("System_ConfirmClearUserData",
				"Caution",
				"您确认要清空用户数据？",
				"", "", "清空", "取消");
		}

	// Dialog
	function AnswerDialog(Selector) {
		switch(Interaction.DialogEvent) {
			case "System_LanguageUnsupported":
			case "System_MajorUpdateDetected":
			case "System_JSONStringInvalid":
			case "System_UserDataExported":
				switch(Selector) {
					case 3:
						break;
					default:
						setTimeout(function() {
							AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						}, 0);
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
						setTimeout(function() {
							AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						}, 0);
						break;
				}
				break;
			case "System_Error":
				switch(Selector) {
					case 2:
						ScrollIntoView("Item_SettingsUserData");
						ShowIAmHere("Item_SettingsUserData");
						break;
					case 3:
						break;
					default:
						setTimeout(function() {
							AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						}, 0);
						break;
				}
				break;
			default:
				setTimeout(function() {
					AlertSystemError("The value of Interaction.DialogEvent \"" + Interaction.DialogEvent + "\" in function AnswerDialog is invalid.");
				}, 0);
				return;
		}
		HideDialog();
	}

// Listeners
	// On keyboard
	document.addEventListener("keydown", function(Hotkey) {
		if(document.activeElement.tagName.toLowerCase() != "input" && document.activeElement.tagName.toLowerCase() != "textarea") { // Prevent hotkey activation when inputing text etc.
			switch(Hotkey.key.toUpperCase()) {
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
					Click("Cmdbtn_VoteCandidate" + Hotkey.key);
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "R":
					Click("Cmdbtn_VoteReset");
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				default:
					if((System.Display.HotkeyIndicators == "ShowOnWrongKeyPress" && IsWrongKeyNegligible(Hotkey.key) == false) ||
					System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
			}
		}
	});

// Error handling
function AlertSystemError(Message) {
	console.error("● 系统错误\n" +
		Message);
	ShowDialog("System_Error",
		"Error",
		"抱歉，发生了系统错误。这可能是损坏了的用户数据导致的。是否前往用户数据？<br />" +
		"<br />" +
		"错误信息：" + Message,
		"", "", "前往", "取消");
}
