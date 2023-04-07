// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../src/ReservNFT.sol";

contract ReservNFTTest is Test {
    ReservNFT reservNFT;

    function setUp() public {
        reservNFT = new ReservNFT();
    }

    function test_createDrop() public {
        reservNFT.createDrop(1, 100, 0.01 ether);
        ReservNFT.Drop memory drop = reservNFT.getDropDetails(1);
        assertEq(drop.dropId, 1);
        assertEq(drop.restaurantId, 100);
        assertEq(drop.mintPrice, 0.01 ether);
        assertTrue(drop.isActive);
    }

    function test_updateDropStatus() public {
        reservNFT.createDrop(1, 100, 0.01 ether);
        reservNFT.updateDropStatus(1, false);
        ReservNFT.Drop memory drop = reservNFT.getDropDetails(1);
        assertFalse(drop.isActive);
    }

    function test_createReservNFT() public payable {
        reservNFT.createDrop(1, 100, 0.01 ether);

        uint256 tokenId = reservNFT.createReservNFT{value: 0.01 ether}(
            1,
            "Test Restaurant",
            123456789,
            1800,
            "ipfs://test-uri"
        );

        ReservNFT.Reservation memory reservation = reservNFT
            .getReservationDetails(tokenId);
        assertEq(reservation.tokenId, tokenId);
        assertEq(reservation.dropId, 1);
        assertEq(reservation.restaurantId, 100);
        assertEq(reservation.reservationDate, 123456789);
        assertEq(reservation.reservationTime, 1800);
        assertEq(reservation.restaurantName, "Test Restaurant");
    }

    function testFail_createReservNFT_insufficientPayment() public {
        reservNFT.createDrop(1, 100, 0.01 ether);

        // Attempt to mint with insufficient payment
        reservNFT.createReservNFT{value: 0.005 ether}(
            1,
            "Test Restaurant",
            123456789,
            1800,
            "ipfs://test-uri"
        );
    }

    function testFail_createReservNFT_inactiveDrop() public {
        reservNFT.createDrop(1, 100, 0.01 ether);
        reservNFT.updateDropStatus(1, false);

        // Attempt to mint from an inactive drop
        reservNFT.createReservNFT{value: 0.01 ether}(
            1,
            "Test Restaurant",
            123456789,
            1800,
            "ipfs://test-uri"
        );
    }
}
