// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AssignmentRegistry {
    struct Submission {
        bytes32 cidHash;
        uint40 submittedAt;
        string[] links; // GitHub, Notion 등 링크들
        bool isLate;
    }

    // key = keccak(cohortId, assignmentId, student)
    mapping(bytes32 => Submission) public submissions;

    // assignmentId -> dueAt
    mapping(uint256 => uint256) public assignmentDeadlines;

    event AssignmentSubmitted(
        bytes32 indexed cohortId,
        uint256 indexed assignmentId,
        address indexed student,
        bytes32 cidHash,
        string[] links
    );

    event AssignmentDeadlineSet(uint256 indexed assignmentId, uint256 dueAt);

    modifier onlyAdmin() {
        // 실제로는 AccessControl 사용 권장
        require(msg.sender == address(0x123), "not admin");
        _;
    }

    function setAssignmentDeadline(
        uint256 assignmentId,
        uint256 dueAt
    ) external onlyAdmin {
        assignmentDeadlines[assignmentId] = dueAt;
        emit AssignmentDeadlineSet(assignmentId, dueAt);
    }

    function submit(
        bytes32 cohortId,
        uint256 assignmentId,
        bytes32 cidHash,
        string[] calldata links
    ) external {
        bytes32 key = keccak256(abi.encode(cohortId, assignmentId, msg.sender));

        require(submissions[key].submittedAt == 0, "already submitted");

        uint256 dueAt = assignmentDeadlines[assignmentId];
        bool isLate = dueAt > 0 && block.timestamp > dueAt;

        submissions[key] = Submission({
            cidHash: cidHash,
            submittedAt: uint40(block.timestamp),
            links: links,
            isLate: isLate
        });

        emit AssignmentSubmitted(
            cohortId,
            assignmentId,
            msg.sender,
            cidHash,
            links
        );
    }

    function getSubmission(
        bytes32 cohortId,
        uint256 assignmentId,
        address student
    ) external view returns (Submission memory) {
        bytes32 key = keccak256(abi.encode(cohortId, assignmentId, student));
        return submissions[key];
    }

    function isSubmissionLate(
        bytes32 cohortId,
        uint256 assignmentId,
        address student
    ) external view returns (bool) {
        bytes32 key = keccak256(abi.encode(cohortId, assignmentId, student));
        return submissions[key].isLate;
    }
}
