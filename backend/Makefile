-include .env

.PHONY: all test clean deploy-anvil

all: clean remove install update build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install rari-capital/solmate && forge install foundry-rs/forge-std

# Update Dependencies
update:; forge update

build:; forge build

test :; forge test -vvvvv

snapshot :; forge snapshot

slither :; slither ./src 

format :; yarn prettier --write src/**/*.sol && yarn prettier --write src/*.sol

# solhint should be installed globally
lint :; yarn solhint src/**/*.sol && yarn solhint src/*.sol

anvil :; anvil -m 'test test test test test test test test test test test junk' --chain-id 31337

# use the "@" to hide the command from your shell 
deploy-sepolia :; @forge script script/${contract}.s.sol:Deploy${contract} --rpc-url ${SEPOLIA_RPC_URL}  --private-key ${PRIVATE_KEY} --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY}  -vvvvv

# needs contract verification at some point

deploy-mumbai :; @forge script script/${contract}.s.sol:Deploy${contract} --rpc-url ${MUMBAI_RPC_URL}  --private-key ${PRIVATE_KEY} --broadcast  -vvvv

# This is the private key of account from the mnemonic from the "make anvil" command
deploy-anvil :; @forge script script/${contract}.s.sol:Deploy${contract} --rpc-url http://localhost:8545  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast  -vvvv --json

update-abi:
	jq '.abi' ./out/${contract}.sol/${contract}.json | tee ../frontend/constants/${contract}.json ../graph/abis/${contract}.json > /dev/null
