var types = require("../types");

var BaseOperand = require("./BaseOperand");

/**
 * Abstract base class of all statements.
 * @constructor
 * @param {number} code
 * @param {!Array.<number|stmt.!BaseOperand>|number|!stmt.BaseOperand} operands
 * @abstract
 * @extends stmt.BaseOperand
 * @exports stmt.BaseStmt
 */
function BaseStmt(code, operands) {
    BaseOperand.call(this);

    /**
     * Parent statement or list.
     * @type {!stmt.BaseStmt|!stmt.StmtList|null}
     */
    this.parent = null;

    /**
     * Opcode.
     * @type {number}
     */
    this.code = code;

    /**
     * Operands.
     * @type {!Array.<number|!stmt.BaseOperand>}
     */
    this.operands = Array.isArray(operands)
        ? operands.slice()
        : typeof operands !== 'undefined'
            ? [operands]
            : [];
}

module.exports = BaseStmt;

// Extends BaseOperand
BaseStmt.prototype = Object.create(BaseOperand.prototype);

/**
 * Expression type.
 * @name stmt.BaseExpr#type
 * @type {number|null}
 */

/**
 * Opcode with imm, if any.
 * @name stmt.BaseStmt#codeWithImm
 * @type {number} -1 if there is no counterpart
 */

/**
 * Behavior.
 * @name stmt.BaseStmt#behavior
 * @type {!stmt.behavior.Behavior}
 */

/**
 * Gets the literal opcode name.
 * @name stmt.BaseStmt#name
 * @type {string}
 */
Object.defineProperty(BaseStmt.prototype, "name", {
    get: function() {
        if (this.type === null)
            return "Stmt:"+types.StmtNames[this.code];
        switch (this.type) {
            case types.RType.I32:
                return "I32:"+types.I32Names[this.code];
            case types.RType.F32:
                return "F32:"+types.F32Names[this.code];
            case types.RType.F64:
                return "F64:"+types.F64Names[this.code];
            case types.RType.Void:
                return "Void:"+types.VoidNames[this.code];
            default:
                throw Error("illegal statement type: "+this.type);
        }
    }
});

/**
 * Adds another operand.
 * @param {number|!stmt.BaseOperand} operand
 */
BaseStmt.prototype.add = function(operand) {
    if (operand instanceof BaseStmt)
        operand.parent = this;
    this.operands.push(operand);
};

/**
 * Returns a string representation of this statement.
 * @param {boolean=} shortFormat
 * @returns {string}
 */
BaseStmt.prototype.toString = function(shortFormat) {
    var sb = [];
    sb.push(this.name);
    if (shortFormat)
        sb.push("+", this.operands.length.toString());
    else
        for (var i=0; i<this.operands.length; ++i) {
            sb.push(" ");
            if (this.operands[i] instanceof BaseStmt)
                sb.push(this.operands[i].toString(true));
            else
                sb.push(this.operands[i].toString());
        }
    return sb.join("");
};
