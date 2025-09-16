// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IERC5192.sol";

// 간단한 ERC721 구현 (OpenZeppelin 없이)
contract BayCertificate is IERC5192 {
    address public minter;
    mapping(uint256 => bool) private _locked; // 항상 true: 비양도
    
    // ERC721 기본 변수들
    string public name = "Bay Certificate";
    string public symbol = "BAY";
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => string) private _tokenURIs;

    event CertificateMinted(
        address indexed to,
        uint256 indexed tokenId,
        string uri,
        bytes32 indexed cohortId
    );

    modifier onlyMinter() {
        require(msg.sender == minter, "not minter");
        _;
    }

    constructor() ERC721("BayCertificate", "BAYCERT") {
        minter = msg.sender;
    }

    function mint(
        address to,
        uint256 tokenId,
        string memory uri,
        bytes32 cohortId
    ) external onlyMinter {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _locked[tokenId] = true;
        emit Locked(tokenId);
        emit CertificateMinted(to, tokenId, uri, cohortId);
    }

    // ERC-5192: 비양도형 토큰 (Soulbound Token)
    // _beforeTokenTransfer 훅을 사용하여 전송을 차단
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual {
        // 민팅(from == address(0))은 허용, 전송은 차단
        if (from != address(0) && to != address(0)) {
            revert("SBT: non-transferable");
        }
    }

    function locked(uint256 tokenId) external view override returns (bool) {
        return _locked[tokenId];
    }

    function isLocked(uint256 tokenId) external view returns (bool) {
        return _locked[tokenId];
    }

    // 배치 민팅 (팀 전체 수료증 발급)
    function batchMint(
        address[] calldata recipients,
        uint256[] calldata tokenIds,
        string[] calldata uris,
        bytes32 cohortId
    ) external onlyMinter {
        require(
            recipients.length == tokenIds.length &&
                tokenIds.length == uris.length,
            "length mismatch"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            _safeMint(recipients[i], tokenIds[i]);
            _setTokenURI(tokenIds[i], uris[i]);
            _locked[tokenIds[i]] = true;
            emit Locked(tokenIds[i]);
            emit CertificateMinted(
                recipients[i],
                tokenIds[i],
                uris[i],
                cohortId
            );
        }
    }
}
