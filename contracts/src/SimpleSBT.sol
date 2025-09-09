// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleSBT {
    string public name;
    string public symbol;
    address public minter;

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bool) private _locked;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Locked(uint256 indexed tokenId);

    constructor(string memory _name, string memory _symbol, address _minter) {
        name = _name;
        symbol = _symbol;
        minter = _minter;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "not minter");
        _;
    }

    function mint(
        address to,
        uint256 tokenId,
        string memory uri
    ) external onlyMinter {
        require(_owners[tokenId] == address(0), "token exists");
        _owners[tokenId] = to;
        _balances[to]++;
        _tokenURIs[tokenId] = uri;
        _locked[tokenId] = true;
        emit Transfer(address(0), to, tokenId);
        emit Locked(tokenId);
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "token not exists");
        return owner;
    }

    function balanceOf(address owner) external view returns (uint256) {
        return _balances[owner];
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_owners[tokenId] != address(0), "token not exists");
        return _tokenURIs[tokenId];
    }

    function locked(uint256 tokenId) external view returns (bool) {
        return _locked[tokenId];
    }

    // SBT: 비양도형
    function transferFrom(address, address, uint256) external pure {
        revert("SBT: non-transferable");
    }

    function safeTransferFrom(address, address, uint256) external pure {
        revert("SBT: non-transferable");
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) external pure {
        revert("SBT: non-transferable");
    }
}
