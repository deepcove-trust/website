/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html

	// The toolbar groups arrangement, optimized for a single toolbar row.
    config.toolbarGroups = [
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        '/',
        { name: 'paragraph', groups: ['align', 'list', 'indent', 'blocks', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        '/',
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'forms', groups: ['forms'] },
        { name: 'insert', groups: ['insert'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
    ];

    config.removeButtons = 'Cut,Copy,Paste,Redo,Anchor,Subscript,JustifyBlock,Blockquote,Font';

	// Dialog windows are also simplified.
    config.removeDialogTabs = 'link:advanced';

    // Default Font Settings
    CKEDITOR.addCss(".cke_editable{cursor:text; font-size: 16px; font-family: Arial, sans-serif; }");
    config.fontSize_sizes = '14/14px;16/16px;18/18px;20/20px;';

    // Spell checker
    CKEDITOR._scaytParams = { sLang: 'en_GB' };
    config.scayt_autoStartup = true;
};
