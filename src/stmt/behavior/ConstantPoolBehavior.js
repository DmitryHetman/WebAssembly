var assert = require("assert"),
    types = require("../../types");

var BaseBehavior = require("./BaseBehavior"),
    Constant = require("../../reflect/Constant");

/**
 * ConstantPool behavior.
 * @param {string} name
 * @param {string} description
 * @param {number} type
 * @constructor
 * @extends stmt.behavior.BaseBehavior
 * @exports stmt.behavior.ConstantPoolBehavior
 */
function ConstantPoolBehavior(name, description, type) {
    BaseBehavior.call(this, name, description);

    /**
     * Constant type.
     * @type {number}
     */
    this.type = type;
}

module.exports = ConstantPoolBehavior;

// Extends Behavior
ConstantPoolBehavior.prototype = Object.create(BaseBehavior.prototype);

// opcode + constant index
// Expr<*>, all with imm

ConstantPoolBehavior.prototype.read = function(s, code, imm) {
    if (imm !== null) {
        s.code(s.without_imm(code));
        s.operand(s.constant(imm));
    } else {
        s.code(code);
        s.operand(s.constant(s.varint()));
    }
};

ConstantPoolBehavior.prototype.validate = function(definition, stmt) {
    assert.strictEqual(stmt.operands.length, 1, this.name+" requires exactly 1 operand");
    var constant = stmt.operands[0];
    assert(constant instanceof Constant, this+" constant (operand 0) must be a Constant");
    assert.strictEqual(constant.assembly, definition.declaration.assembly, this.name+" constant (operand 0) must be part of this assembly");
    assert.strictEqual(constant.type, this.type, this.name+" constant (operand 0) type must be "+types.RTypeNames[this.type]);
};

ConstantPoolBehavior.prototype.write = function(s, stmt) {
    var codeWithImm;
    if (stmt.operands[0].index <= types.ImmMax && (codeWithImm = s.with_imm(stmt.code)) >= 0)
        s.code(codeWithImm, stmt.operands[0].index);
    else {
        s.code(stmt.code);
        s.varint(stmt.operands[0].index);
    }
};
