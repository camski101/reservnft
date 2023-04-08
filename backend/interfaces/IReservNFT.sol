// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IReservNFT {
    struct Reservation {
        uint256 tokenId;
        uint256 dropId;
        uint256 restaurantId;
        uint256 reservationTimestamp; // Represents both date and time
    }

    function getReservationDetails(
        uint256 tokenId
    ) external view returns (Reservation memory);
}
