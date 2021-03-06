/*!
 * ${copyright}
 */

sap.ui.define(['sap/ui/core/ValueStateSupport', 'sap/ui/core/library'],
	function(ValueStateSupport, coreLibrary) {
	"use strict";


	// shortcut for sap.ui.core.TextDirection
	var TextDirection = coreLibrary.TextDirection;

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;


	/**
	 * ObjectStatus renderer.
	 * @namespace
	 */
	var ObjectStatusRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oObjStatus An object representation of the control that should be rendered
	 */
	ObjectStatusRenderer.render = function(oRm, oObjStatus){
		oRm.write("<div");

		if (oObjStatus._isEmpty()) {
			oRm.writeControlData(oObjStatus);
			oRm.addStyle("display", "none");
			oRm.writeStyles();
			oRm.write(">");
		} else {

			var sState = oObjStatus.getState();
			var sTextDir = oObjStatus.getTextDirection();
			var sTitleDir = sTextDir;

			oRm.writeControlData(oObjStatus);

			var sTooltip = oObjStatus.getTooltip_AsString();
			if (sTooltip) {
				oRm.writeAttributeEscaped("title", sTooltip);
			}

			oRm.addClass("sapMObjStatus");
			oRm.addClass("sapMObjStatus" + sState);
			oRm.writeClasses();

			/* ARIA region adding the aria-describedby to ObjectStatus */

			if (sState != ValueState.None) {
				oRm.writeAccessibilityState(oObjStatus, {
					describedby: {
						value: oObjStatus.getId() + "sapSRH",
						append: true
					}
				});
			}

			oRm.write(">");

			if (oObjStatus.getTitle()) {
				var bPageRTL = sap.ui.getCore().getConfiguration().getRTL();
				// if the textDirection is inherit, set the one that the page has for the title
				if (sTitleDir === TextDirection.Inherit) {
					sTitleDir = bPageRTL ? TextDirection.RTL : TextDirection.LTR;
				}

				oRm.write("<span");
				oRm.writeAttributeEscaped("id", oObjStatus.getId() + "-title");
				oRm.addClass("sapMObjStatusTitle");

				if (sTitleDir) {
					oRm.writeAttribute("dir", sTitleDir.toLowerCase());
				}
				oRm.writeClasses();
				oRm.write(">");
				oRm.writeEscaped(oObjStatus.getTitle() + ":");
				oRm.write("</span>");
			}

			if (oObjStatus.getIcon()) {
				oRm.write("<span");
				oRm.writeAttributeEscaped("id", oObjStatus.getId() + "-icon");
				oRm.addClass("sapMObjStatusIcon");
				oRm.writeClasses();
				oRm.write(">");
				oRm.renderControl(oObjStatus._getImageControl());
				oRm.write("</span>");
			}

			if (oObjStatus.getText()) {
				oRm.write("<span");
				oRm.writeAttributeEscaped("id", oObjStatus.getId() + "-text");
				oRm.addClass("sapMObjStatusText");

				if (sTextDir && sTextDir !== TextDirection.Inherit) {
					oRm.writeAttribute("dir", sTextDir.toLowerCase());
				}

				oRm.writeClasses();
				oRm.write(">");
				oRm.writeEscaped(oObjStatus.getText());
				oRm.write("</span>");
			}

			/* ARIA adding hidden node in span element */
			if (sState != ValueState.None) {
				oRm.write("<span");
				oRm.writeAttributeEscaped("id", oObjStatus.getId() + "sapSRH");
				oRm.addClass("sapUiInvisibleText");
				oRm.writeClasses();
				oRm.writeAccessibilityState({
					hidden: false
				});
				oRm.write(">");
				oRm.writeEscaped(ValueStateSupport.getAdditionalText(sState));
				oRm.write("</span>");
			}
		}

		oRm.write("</div>");
	};

	return ObjectStatusRenderer;

}, /* bExport= */ true);
