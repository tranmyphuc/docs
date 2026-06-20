package aegis.arbitrate

# A proposal is vetoed when it erodes control coverage of a resource bound by a
# mandatory obligation. Mirrors core/kernel::is_vetoed so policy and engine agree.
default veto := false

veto if {
    some o in input.obligations
    o.severity == "mandatory"
    o.resource == input.proposal.resource
    input.proposal.reduces_control_coverage == true
}
