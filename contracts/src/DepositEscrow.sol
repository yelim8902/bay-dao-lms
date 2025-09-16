// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address, address, uint256) external returns (bool);

    function transfer(address, uint256) external returns (bool);
}

contract DepositEscrow {
    IERC20 public immutable token;
    address public verifier; // TA/운영 지갑
    address public treasury; // 슬래시 수취처

    struct Stake {
        uint256 amount;
        bool settled;
    }

    // cohortId -> user -> stake
    mapping(bytes32 => mapping(address => Stake)) public stakes;

    event Deposit(
        bytes32 indexed cohortId,
        address indexed user,
        uint256 amount
    );
    event Refund(
        bytes32 indexed cohortId,
        address indexed user,
        uint256 amount
    );
    event Slash(
        bytes32 indexed cohortId,
        address indexed user,
        uint256 amount,
        uint256 slashAmount
    );

    modifier onlyVerifier() {
        require(msg.sender == verifier, "not verifier");
        _;
    }

    constructor(IERC20 _token, address _verifier, address _treasury) {
        token = _token;
        verifier = _verifier;
        treasury = _treasury;
    }

    function deposit(bytes32 cohortId, uint256 amt) external {
        // 중복 예치 허용 - 기존 예치가 있으면 추가
        require(amt > 0, "amount must be positive");
        require(
            token.transferFrom(msg.sender, address(this), amt),
            "transfer failed"
        );

        // 기존 예치가 있으면 추가, 없으면 새로 생성
        if (stakes[cohortId][msg.sender].amount > 0) {
            stakes[cohortId][msg.sender].amount += amt;
        } else {
            stakes[cohortId][msg.sender] = Stake(amt, false);
        }
        emit Deposit(cohortId, msg.sender, amt);
    }

    function refund(bytes32 cohortId, address user) external onlyVerifier {
        Stake storage s = stakes[cohortId][user];
        require(!s.settled && s.amount > 0, "invalid stake");

        s.settled = true;
        require(token.transfer(user, s.amount), "refund failed");
        emit Refund(cohortId, user, s.amount);
    }

    // 학생이 직접 반환할 수 있는 함수
    function selfRefund(bytes32 cohortId) external {
        Stake storage s = stakes[cohortId][msg.sender];
        require(!s.settled && s.amount > 0, "invalid stake");

        s.settled = true;
        require(token.transfer(msg.sender, s.amount), "refund failed");
        emit Refund(cohortId, msg.sender, s.amount);
    }

    // bps 예: 3000 => 30% 슬래시
    function slash(
        bytes32 cohortId,
        address user,
        uint256 bps
    ) external onlyVerifier {
        Stake storage s = stakes[cohortId][user];
        require(!s.settled && s.amount > 0, "invalid stake");
        require(bps <= 10000, "invalid bps");

        s.settled = true;
        uint256 slashAmount = (s.amount * bps) / 10000;
        uint256 refundAmount = s.amount - slashAmount;

        if (slashAmount > 0) {
            require(
                token.transfer(treasury, slashAmount),
                "slash transfer failed"
            );
        }
        if (refundAmount > 0) {
            require(
                token.transfer(user, refundAmount),
                "refund transfer failed"
            );
        }

        emit Slash(cohortId, user, s.amount, slashAmount);
    }

    function getStake(
        bytes32 cohortId,
        address user
    ) external view returns (uint256 amount, bool settled) {
        Stake memory s = stakes[cohortId][user];
        return (s.amount, s.settled);
    }
}
