// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CohortManager {
    struct Cohort {
        bytes32 id;
        string name;
        string track; // "research" | "development"
        uint256 depositAmount;
        uint256 startAt;
        uint256 endAt;
        uint256 minPassRate; // bps, e.g., 7000 = 70%
        bool isActive;
    }

    struct Team {
        bytes32 id;
        bytes32 cohortId;
        string name;
        address leader;
        address[] members;
        bool depositCompleted;
    }

    mapping(bytes32 => Cohort) public cohorts;
    mapping(bytes32 => Team) public teams;
    mapping(bytes32 => bytes32[]) public cohortTeams; // cohortId => teamIds[]
    mapping(address => bytes32[]) public userTeams; // user => teamIds[]

    event CohortCreated(
        bytes32 indexed cohortId,
        string name,
        string track,
        uint256 depositAmount
    );

    event TeamCreated(
        bytes32 indexed teamId,
        bytes32 indexed cohortId,
        string name,
        address leader
    );

    event TeamMemberAdded(bytes32 indexed teamId, address indexed member);

    modifier onlyAdmin() {
        require(msg.sender == address(0x123), "not admin");
        _;
    }

    function createCohort(
        bytes32 cohortId,
        string calldata name,
        string calldata track,
        uint256 depositAmount,
        uint256 startAt,
        uint256 endAt,
        uint256 minPassRate
    ) external onlyAdmin {
        require(cohorts[cohortId].id == bytes32(0), "cohort exists");
        require(minPassRate <= 10000, "invalid pass rate");

        cohorts[cohortId] = Cohort({
            id: cohortId,
            name: name,
            track: track,
            depositAmount: depositAmount,
            startAt: startAt,
            endAt: endAt,
            minPassRate: minPassRate,
            isActive: true
        });

        emit CohortCreated(cohortId, name, track, depositAmount);
    }

    function createTeam(
        bytes32 teamId,
        bytes32 cohortId,
        string calldata name
    ) external {
        require(cohorts[cohortId].isActive, "cohort not active");
        require(teams[teamId].id == bytes32(0), "team exists");

        teams[teamId] = Team({
            id: teamId,
            cohortId: cohortId,
            name: name,
            leader: msg.sender,
            members: new address[](0),
            depositCompleted: false
        });

        teams[teamId].members.push(msg.sender);
        cohortTeams[cohortId].push(teamId);
        userTeams[msg.sender].push(teamId);

        emit TeamCreated(teamId, cohortId, name, msg.sender);
    }

    function addTeamMember(bytes32 teamId, address member) external {
        require(teams[teamId].leader == msg.sender, "not team leader");
        require(teams[teamId].members.length < 5, "team full"); // 최대 5명

        teams[teamId].members.push(member);
        userTeams[member].push(teamId);

        emit TeamMemberAdded(teamId, member);
    }

    function getCohort(bytes32 cohortId) external view returns (Cohort memory) {
        return cohorts[cohortId];
    }

    function getTeam(bytes32 teamId) external view returns (Team memory) {
        return teams[teamId];
    }

    function getCohortTeams(
        bytes32 cohortId
    ) external view returns (bytes32[] memory) {
        return cohortTeams[cohortId];
    }

    function getUserTeams(
        address user
    ) external view returns (bytes32[] memory) {
        return userTeams[user];
    }

    function isTeamMember(
        bytes32 teamId,
        address member
    ) external view returns (bool) {
        address[] memory members = teams[teamId].members;
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == member) return true;
        }
        return false;
    }
}
