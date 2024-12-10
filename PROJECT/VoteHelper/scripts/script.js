// For SamToki.github.io/VoteHelper
// Released under GNU GPL v3 open source license.
// © 2023 SAM TOKI STUDIO

// Initialization
	// Declare variables
	"use strict";
		// Unsaved
		const CurrentVersion = 3.08;
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

	// Load
	window.onload = Load();
	function Load() {
		// User data
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
					"Caution",
					"<span lang=\"en-US\">Sorry, this webpage currently does not support English (US).</span>",
					"", "", "", "<span lang=\"en-US\">OK</span>");
				break;
			case "ja-JP":
				ShowDialog("System_LanguageUnsupported",
					"Caution",
					"<span lang=\"ja-JP\">すみません。このページは日本語にまだサポートしていません。</span>",
					"", "", "", "<span lang=\"ja-JP\">OK</span>");
				break;
			case "zh-CN":
				break;
			case "zh-TW":
				ShowDialog("System_LanguageUnsupported",
					"Caution",
					"<span lang=\"zh-TW\">抱歉，本網頁暫不支援繁體中文。</span>",
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

		// Refresh
		RefreshSystem();
		RefreshVote();

		// PWA
		navigator.serviceWorker.register("script_ServiceWorker.js").then(function(ServiceWorkerRegistration) {
			// Detect update (https://stackoverflow.com/a/41896649)
			ServiceWorkerRegistration.addEventListener("updatefound", function() {
				const ServiceWorkerInstallation = ServiceWorkerRegistration.installing;
				ServiceWorkerInstallation.addEventListener("statechange", function() {
					if(ServiceWorkerInstallation.state == "installed" && navigator.serviceWorker.controller != null) {
						Show("Label_HelpPWANewVersionReady");
						ShowDialog("System_PWANewVersionReady",
							"Info",
							"新版本已就绪，将在下次启动时生效。",
							"", "", "", "确定");
					}
				});
			});

			// Read service worker status (https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/registration-events/index.html)
			switch(true) {
				case ServiceWorkerRegistration.installing != null:
					ChangeText("Label_SettingsPWAServiceWorkerRegistration", "等待生效");
					break;
				case ServiceWorkerRegistration.waiting != null:
					ChangeText("Label_SettingsPWAServiceWorkerRegistration", "等待更新");
					Show("Label_HelpPWANewVersionReady");
					ShowDialog("System_PWANewVersionReady",
						"Info",
						"新版本已就绪，将在下次启动时生效。",
						"", "", "", "确定");
					break;
				case ServiceWorkerRegistration.active != null:
					ChangeText("Label_SettingsPWAServiceWorkerRegistration", "已生效");
					break;
				default:
					break;
			}
			if(navigator.serviceWorker.controller != null) {
				ChangeText("Label_SettingsPWAServiceWorkerController", "已生效");
			} else {
				ChangeText("Label_SettingsPWAServiceWorkerController", "未生效");
			}
		});

		// Ready
		setTimeout(HideToast, 0);
	}

// Refresh
	// Webpage
	function RefreshWebpage() {
		ShowDialog("System_RefreshingWebpage",
			"Info",
			"正在刷新网页...",
			"", "", "", "确定");
		ChangeCursorOverall("wait");
		window.location.reload();
	}

	// System
	function RefreshSystem() {
		// Topbar
		if(IsMobileLayout() == false) {
			HideHorizontally("Button_Nav");
			ChangeInert("DropctrlGroup_Nav", false);
		} else {
			Show("Button_Nav");
			ChangeInert("DropctrlGroup_Nav", true);
		}

		// Fullscreen
		if(IsFullscreen() == false) {
			Show("Topbar");
			ChangeText("Button_VoteToggleFullscreen",
				"<svg class=\"Icon\" viewBox=\"0 0 16 16\" aria-hidden=\"true\">" +
				"	<path d=\"M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707\"/>" +
				"</svg>");
			ChangeTooltip("Button_VoteToggleFullscreen", "全屏");
			ChangeAriaLabel("Button_VoteToggleFullscreen", "全屏");
		} else {
			Hide("Topbar");
			ChangeText("Button_VoteToggleFullscreen",
				"<svg class=\"Icon\" viewBox=\"0 0 16 16\" aria-hidden=\"true\">" +
				"	<path d=\"M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z\"/>" +
				"</svg>");
			ChangeTooltip("Button_VoteToggleFullscreen", "退出全屏");
			ChangeAriaLabel("Button_VoteToggleFullscreen", "退出全屏");
		}

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
				AddClass("BgImage", "Blur");
			} else {
				RemoveClass("BgImage", "Blur");
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

			// PWA
			if(window.matchMedia("(display-mode: standalone)").matches == true) {
				ChangeText("Label_SettingsPWAStandaloneDisplay", "是");
			} else {
				ChangeText("Label_SettingsPWAStandaloneDisplay", "否");
			}

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
			ChangeDisabled("Button_VoteCandidate" + Looper, false);
			Show("Dropctrl_VoteUndo" + Looper);
			if(Vote.Stats.Elapsed[Looper] > 0) {
				ChangeDisabled("Button_VoteUndo" + Looper, false);
			} else {
				ChangeDisabled("Button_VoteUndo" + Looper, true);
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
			ChangeDisabled("Button_VoteUndo", false);
			ChangeDisabled("Button_VoteReset", false);
		} else {
			Percentage = 0;
			ChangeDisabled("Button_VoteUndo", true);
			ChangeDisabled("Button_VoteReset", true);
		}
		ChangeText("Label_VoteElapsed", Vote0.Stats.ElapsedSum);
		ChangeText("Label_VoteTotal", "/" + Vote.Options.TotalVotes);
		ChangeProgring("ProgringFg_Vote", 80, Percentage);
		ChangeText("ProgringText_Vote", Percentage.toFixed(0) + "%");
		ChangeHeight("DropctrlGroup_VoteUndo", 35 * Vote.Options.CandidateQuantity + 2 + "px");

		// Finish voting
		if(Vote0.Stats.ElapsedSum >= Vote.Options.TotalVotes) {
			Vote0.Stats.ElapsedSum = Vote.Options.TotalVotes;
			for(let Looper = 1; Looper <= Vote.Options.CandidateQuantity; Looper++) {
				ChangeDisabled("Button_VoteCandidate" + Looper, true);
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
					RefreshWebpage();
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
				"已导出本网页的用户数据至剪贴板。",
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
		let DialogEvent = Interaction.Dialog[Interaction.Dialog.length - 1].Event;
		Interaction.Dialog.splice(Interaction.Dialog.length - 1, 1);
		ShowDialog("Previous");
		switch(DialogEvent) {
			case "System_LanguageUnsupported":
			case "System_MajorUpdateDetected":
			case "System_PWANewVersionReady":
			case "System_RefreshingWebpage":
			case "System_JSONStringInvalid":
			case "System_UserDataExported":
				switch(Selector) {
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			case "System_ConfirmClearUserData":
				switch(Selector) {
					case 2:
						localStorage.clear();
						RefreshWebpage();
						break;
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
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
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			default:
				AlertSystemError("The value of DialogEvent \"" + DialogEvent + "\" in function AnswerDialog is invalid.");
				break;
		}
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
					Click("Button_VoteCandidate" + Hotkey.key);
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "U":
					Click("Button_VoteUndo");
					Focus("Button_VoteUndo");
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "R":
					Click("Button_VoteReset");
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "F":
					Click("Button_VoteToggleFullscreen");
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
		"抱歉，发生了系统错误。您可尝试清空用户数据来修复错误，或向我提供反馈。<br />" +
		"<br />" +
		"错误信息：" + Message,
		"", "", "了解更多", "关闭");
}
