import { Badge } from "../entities/Badge";
import { Tooltip } from "../Utils/Modules";

export default function ReviewBadge(badge: Badge) {

    return (
        <Tooltip
            text={badge.name}>
            {({ onMouseEnter, onMouseLeave }) => (
                <img
                    width="24px"
                    height="24px"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    src={badge.icon}
                    alt={badge.description}
                    style={{ verticalAlign: "middle", marginLeft: "4px" }}
                    onClick={() =>
                        window.open(
                            badge.redirectURL
                        )
                    }
                />
            )}
        </Tooltip>
    );

}
