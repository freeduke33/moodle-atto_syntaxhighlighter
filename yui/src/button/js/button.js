// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * String for component 'atto_syntaxhighlighter', language 'en'
 *
 * @package     atto_syntaxhighlighter
 * @copyright   2016 The Global A Team
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

 /**
  * @module moodle-atto_syntaxhighlighter-button
  */
var COMPONENTNAME = 'atto_syntaxhighlighter';
var STYLE = {
    CODEAREA: 'atto_syntaxhighlighter_codearea'
};
var SELECTORS = {
    CODEAREA: '.atto_syntaxhighlighter_codearea'
};

var TEMPLATE = '<form class="atto_form">' +
                    '<label for="{{elementid}}_atto_syntaxhighlighter_codearea">Some label</label>' +
                    '<select class="language">' +
                        '<option value="c">C</option>' +
                        '<option value="cpp">C++</option>' +
                        '<option value="html">HTML</option>' +
                        '<option value="javascript">Javascript</option>' +
                        '<option value="php">PHP</option>' +
                        '<option value="python">Python</option>' +
                        '<option value="sql">SQL</option>' +
                    '</select>' +
                    '<textarea class="fullwidth code {{style.CODEAREA}}" rows="8" cols="32"></textarea><br>' +
                    '<div class="mdl-align">' +
                        '<br>' +
                        '<button type="submit" class="submit">Add codesnippet</button>' +
                    '</div>' +
                '</form>';

var logic = {
    _selectedLanguage: null,
    _currentSelection: null,
    _content: null,
    initializer: function() {
        this.addButton({
            icon: 'e/source_code',
            callback: this._displayDialogue
        });
    },

    _displayDialogue: function() {
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false) {
            return;
        }

        var dialogue = this.getDialogue({
            headerContent: 'Some header content', //M.util.get_string('Add code snippet', COMPONENTNAME),
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.CODEAREA
        });

        dialogue.set('bodyContent', this._getDialogueContent());
        dialogue.show();
    },

    _setCode: function(event) {
        event.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var input = this._content.one('.code');
        var value = input.get('value');

        this._wrapCode(value);
    },
    _wrapCode: function(code) {
        this.editor.focus();
        var host = this.get('host');
        host.setSelection(this._currentSelection);

        var selectednode;
        var collapsed = (this._currentSelection[0].collapsed);
        if (collapsed) {
            var codenode = Y.Node.create('<code>' + code + '</code>');

            codenode.setAttribute('class', this._selectedLanguage);
            var prenode = Y.Node.create('<pre>' + codenode.get('outerHTML') + '</pre>');

            selectednode = host.insertContentAtFocusPoint(prenode.get('outerHTML'));
            host.setSelection(host.getSelectionFromNode(selectednode));
        }

        if (!selectednode) {
            return;
        }
        return selectednode;
    },
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE);
        this._content = Y.Node.create(template({
            component: COMPONENTNAME,
            style: STYLE
        }));

        this._content.one('.language').on('valuechange', function(event) {
            this._selectedLanguage = event.newVal;
        }, this);

        this._content.one('.submit').on('click', this._setCode, this);

        return this._content;
    }
};

 /**
  * Atto text editor syntax highlighter plugin.
  *
  * @namespace M.atto_syntaxhighlighter
  * @class button
  * @extends M.editor_atto.EditorPlugin
  */
Y.namespace('M.atto_syntaxhighlighter').Button =
    Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], logic);
