// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DepositEscrow.sol";
import "./AssignmentRegistry.sol";
import "./CohortManager.sol";

interface IEAS {
    function attest(
        bytes32 schema,
        bytes calldata data
    ) external returns (bytes32 attestationUID);
}

contract VerifierGateway {
    IEAS public eas;
    DepositEscrow public escrow;
    AssignmentRegistry public registry;
    CohortManager public cohortManager;

    struct Review {
        bytes32 attestationUID;
        address reviewer;
        uint8 score; // 0-100
        bool pass;
        uint256 timestamp;
    }

    struct AssignmentResult {
        bytes32 cohortId;
        uint256 assignmentId;
        address student;
        uint8 totalScore;
        bool passed;
        uint256 reviewCount;
        bool settled;
    }

    // key = keccak(cohortId, assignmentId, student)
    mapping(bytes32 => Review[]) public reviews;
    mapping(bytes32 => AssignmentResult) public assignmentResults;

    // N-of-M 검증 규칙: 최소 리뷰 수, 최소 평균 점수
    mapping(bytes32 => uint256) public minReviewsRequired; // cohortId => count
    mapping(bytes32 => uint256) public minPassScore; // cohortId => score

    event ReviewAdded(
        bytes32 indexed cohortId,
        uint256 indexed assignmentId,
        address indexed student,
        bytes32 attestationUID,
        uint8 score,
        bool pass
    );

    event AssignmentSettled(
        bytes32 indexed cohortId,
        uint256 indexed assignmentId,
        address indexed student,
        uint8 totalScore,
        bool passed
    );

    modifier onlyVerifier() {
        require(msg.sender == address(0x456), "not verifier");
        _;
    }

    constructor(
        address _eas,
        address _escrow,
        address _registry,
        address _cohortManager
    ) {
        eas = IEAS(_eas);
        escrow = DepositEscrow(_escrow);
        registry = AssignmentRegistry(_registry);
        cohortManager = CohortManager(_cohortManager);
    }

    function setVerificationRules(
        bytes32 cohortId,
        uint256 minReviews,
        uint256 minScore
    ) external onlyVerifier {
        minReviewsRequired[cohortId] = minReviews;
        minPassScore[cohortId] = minScore;
    }

    function addReview(
        bytes32 cohortId,
        uint256 assignmentId,
        address student,
        uint8 score,
        bool pass,
        string calldata comment
    ) external onlyVerifier returns (bytes32) {
        bytes32 key = keccak256(abi.encode(cohortId, assignmentId, student));

        // EAS 어테스테이션 생성
        bytes memory data = abi.encode(
            cohortId,
            assignmentId,
            student,
            score,
            pass,
            comment
        );

        bytes32 attestationUID = eas.attest(
            keccak256(
                "AssignmentReview(bytes32,uint256,address,uint8,bool,string)"
            ),
            data
        );

        reviews[key].push(
            Review({
                attestationUID: attestationUID,
                reviewer: msg.sender,
                score: score,
                pass: pass,
                timestamp: block.timestamp
            })
        );

        emit ReviewAdded(
            cohortId,
            assignmentId,
            student,
            attestationUID,
            score,
            pass
        );

        return attestationUID;
    }

    function settleAssignment(
        bytes32 cohortId,
        uint256 assignmentId,
        address student
    ) external onlyVerifier {
        bytes32 key = keccak256(abi.encode(cohortId, assignmentId, student));

        require(!assignmentResults[key].settled, "already settled");

        Review[] memory reviewList = reviews[key];
        require(
            reviewList.length >= minReviewsRequired[cohortId],
            "insufficient reviews"
        );

        uint256 totalScore = 0;
        uint256 passCount = 0;

        for (uint256 i = 0; i < reviewList.length; i++) {
            totalScore += reviewList[i].score;
            if (reviewList[i].pass) passCount++;
        }

        uint8 averageScore = uint8(totalScore / reviewList.length);
        bool passed = averageScore >= minPassScore[cohortId] &&
            passCount >= minReviewsRequired[cohortId];

        assignmentResults[key] = AssignmentResult({
            cohortId: cohortId,
            assignmentId: assignmentId,
            student: student,
            totalScore: averageScore,
            passed: passed,
            reviewCount: reviewList.length,
            settled: true
        });

        emit AssignmentSettled(
            cohortId,
            assignmentId,
            student,
            averageScore,
            passed
        );
    }

    function batchSettleTeam(
        bytes32 cohortId,
        uint256 assignmentId,
        address[] calldata students
    ) external onlyVerifier {
        for (uint256 i = 0; i < students.length; i++) {
            _settleAssignment(cohortId, assignmentId, students[i]);
        }
    }

    function _settleAssignment(
        bytes32 cohortId,
        uint256 assignmentId,
        address student
    ) internal {
        bytes32 key = keccak256(abi.encode(cohortId, assignmentId, student));

        require(!assignmentResults[key].settled, "already settled");

        Review[] memory reviewList = reviews[key];
        require(
            reviewList.length >= minReviewsRequired[cohortId],
            "insufficient reviews"
        );

        uint256 totalScore = 0;
        uint256 passCount = 0;

        for (uint256 i = 0; i < reviewList.length; i++) {
            totalScore += reviewList[i].score;
            if (reviewList[i].pass) passCount++;
        }

        uint8 averageScore = uint8(totalScore / reviewList.length);
        bool passed = averageScore >= minPassScore[cohortId] &&
            passCount >= minReviewsRequired[cohortId];

        assignmentResults[key] = AssignmentResult({
            cohortId: cohortId,
            assignmentId: assignmentId,
            student: student,
            totalScore: averageScore,
            passed: passed,
            reviewCount: reviewList.length,
            settled: true
        });

        emit AssignmentSettled(
            cohortId,
            assignmentId,
            student,
            averageScore,
            passed
        );
    }

    function getAssignmentResult(
        bytes32 cohortId,
        uint256 assignmentId,
        address student
    ) external view returns (AssignmentResult memory) {
        bytes32 key = keccak256(abi.encode(cohortId, assignmentId, student));
        return assignmentResults[key];
    }

    function getReviews(
        bytes32 cohortId,
        uint256 assignmentId,
        address student
    ) external view returns (Review[] memory) {
        bytes32 key = keccak256(abi.encode(cohortId, assignmentId, student));
        return reviews[key];
    }
}
