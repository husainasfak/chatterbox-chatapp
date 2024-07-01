"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Enums
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "PENDING";
    RequestStatus["ACCEPTED"] = "ACCEPTED";
    RequestStatus["DECLINED"] = "DECLINED";
})(RequestStatus || (RequestStatus = {}));
var ParticipantRole;
(function (ParticipantRole) {
    ParticipantRole["ADMIN"] = "ADMIN";
    ParticipantRole["MODERATOR"] = "MODERATOR";
    ParticipantRole["GUEST"] = "GUEST";
})(ParticipantRole || (ParticipantRole = {}));
