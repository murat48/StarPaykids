#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, contractmeta, Address, Env};

// Contract metadata
contractmeta!(
    key = "Description",
    val = "StarPayKids Allowance Contract - Send allowance to children"
);

// Data keys for persistent storage
#[contracttype]
pub enum DataKey {
    TotalSent,    // Total amount sent as allowance
    LastChild,    // Last child address that received allowance
}

#[contract]
pub struct AllowanceContract;

#[contractimpl]
impl AllowanceContract {
    /// Send allowance to a child address
    /// Saves the transaction and updates totals
    pub fn send_allowance(env: Env, child_address: Address, amount: u32) {
        // Get current total sent amount (default to 0 if not exists)
        let current_total: u32 = env.storage().persistent().get(&DataKey::TotalSent).unwrap_or(0);
        
        // Add new amount to total
        let new_total = current_total + amount;
        
        // Store updated total
        env.storage().persistent().set(&DataKey::TotalSent, &new_total);
        
        // Store last child address
        env.storage().persistent().set(&DataKey::LastChild, &child_address);
        
        // Extend the TTL (time to live) for persistent storage
        env.storage().persistent().extend_ttl(&DataKey::TotalSent, 100, 100);
        env.storage().persistent().extend_ttl(&DataKey::LastChild, 100, 100);
    }
    
    /// Get total amount sent as allowance
    pub fn get_total_sent(env: Env) -> u32 {
        env.storage().persistent().get(&DataKey::TotalSent).unwrap_or(0)
    }
    
    /// Get the last child address that received allowance
    pub fn get_last_child(env: Env) -> Option<Address> {
        env.storage().persistent().get(&DataKey::LastChild)
    }
}

mod test;
