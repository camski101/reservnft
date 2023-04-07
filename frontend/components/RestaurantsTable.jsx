import React from "react"
import { Table, Button } from "web3uikit"
import Link from "next/link"

export const RestaurantsTable = ({ data, columnsConfig, header, showStatus, onToggleStatus }) => {
    return (
        <Table
            columnsConfig={columnsConfig}
            data={data.map((restaurant) => [
                <Link key={restaurant.id} href={`/restaurants/${restaurant.restaurantId}`}>
                    {restaurant.name}
                </Link>,
                <div>{restaurant.businessAddress}</div>,
                ...(showStatus
                    ? [
                          <div>{restaurant.isActive ? "Active" : "Inactive"}</div>,
                          <Button
                              onClick={() => onToggleStatus(restaurant)}
                              theme="primary"
                              text={restaurant.isActive ? "Deactivate" : "Activate"}
                          />,
                      ]
                    : []),
            ])}
            header={header}
            isColumnSortable={[true, false, false]}
            maxPages={10}
            onPageNumberChanged={function noRefCheck() {}}
            onRowClick={function noRefCheck() {}}
            pageSize={5}
        />
    )
}
