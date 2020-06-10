# TKOs dAPP

## Installation
```
yarn
```

## Configuration
To run the dAPP, please add a network profile. Feel free to duplicate the `input/network/example` profile. You can quickly do it by running:
```
cp ./input/network/example input/network/ropsten
```
And then modifying the JSON files accordingly.

## Sending a transaction
```
# use `private` profile (i.e. to utiles Ganache local blockchain)
NETWORK_NAME=private node src

# use `rinkeby` network profile
NETWORK_NAME=rinkeby node src
 ```