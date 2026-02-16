pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template CredentialProof() {
    signal input secret;
    signal input credentialHash;

    component poseidon = Poseidon(1);
    poseidon.inputs[0] <== secret;

    credentialHash === poseidon.out;
}

// Public input: credentialHash
// Private input: secret
component main {public [credentialHash]} = CredentialProof();
