#![cfg(test)]

use super::{AllowanceContract, AllowanceContractClient};
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_send_allowance() {
    let env = Env::default();
    let contract_id = env.register_contract(None, AllowanceContract);
    let client = AllowanceContractClient::new(&env, &contract_id);

    // Create test addresses
    let child1 = Address::generate(&env);
    let child2 = Address::generate(&env);

    // Test initial state
    assert_eq!(client.get_total_sent(), 0);
    assert_eq!(client.get_last_child(), None);

    // Send first allowance
    client.send_allowance(&child1, &100);
    assert_eq!(client.get_total_sent(), 100);
    assert_eq!(client.get_last_child(), Some(child1.clone()));

    // Send second allowance
    client.send_allowance(&child2, &50);
    assert_eq!(client.get_total_sent(), 150);
    assert_eq!(client.get_last_child(), Some(child2.clone()));
}

#[test]
fn test_multiple_sends_to_same_child() {
    let env = Env::default();
    let contract_id = env.register_contract(None, AllowanceContract);
    let client = AllowanceContractClient::new(&env, &contract_id);

    let child = Address::generate(&env);

    // Send multiple allowances to same child
    client.send_allowance(&child, &25);
    client.send_allowance(&child, &75);
    
    assert_eq!(client.get_total_sent(), 100);
    assert_eq!(client.get_last_child(), Some(child));
}
